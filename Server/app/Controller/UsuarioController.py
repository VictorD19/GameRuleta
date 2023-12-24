import os
from fastapi import Response, WebSocket, HTTPException
from sqlalchemy import select, and_, desc
from dotenv import load_dotenv
from random import choice

# from Models.Apuesta import Apuesta
from Service.APIAsaasService import NewCobropix, NewTransferenciaPIX
from Service.send_mail import Send_Mail
from Service import templates_mail
from Service.datetime_now import datetime_local_actual
from Service.securtity import get_password_hash
from Schemas.Exection import ControllerException
from Schemas.SchemaUser import (
    UserPublic,
    NuevoUsuario,
    TransaccionesBanco,
    RetiroFondos,
    StatusPix,
)
from Schemas.Apuesta import UltimaApuesta
from Service.TelegramBot import send_mensaje_telegram
from Models.model import (
    Session,
    TransacEntradaModel,
    UserModel,
    TransacSalidaModel,
    ApuestaModel,
)
from datetime import datetime


load_dotenv()


class Usuario:
    def __init__(self, session: Session):
        self.session = session

    def genSenha(self):
        return "".join([choice("ABCDEFGHJKLMNPQRSTUWXYZ123456789") for _ in range(6)])

    def recuperaSenha(self, usuario: UserModel):
        try:
            senha_aleatoria = self.genSenha()
            mensaje = templates_mail.mensaje_recuperacion_senha(
                nombreCliente=usuario.username,
                nombreSite=os.getenv("NOMBRE_SITE"),
                clave=senha_aleatoria,
            )

            if not (
                Send_Mail(
                    destino=usuario.email,
                    asunto="Recuperação de senha.",
                    adj=False,
                    mensaje=mensaje,
                ).send()
            ):
                raise ControllerException("_")

            usuario.password = get_password_hash(senha_aleatoria)
            self.session.commit()
            self.session.refresh(usuario)
            return True

        except ControllerException as ex:
            self.session.rollback()
            return False

        except Exception as ex:
            self.session.rollback()
            return False

    def ultimas_apuestas(self, usuario: UserModel):
        apuestas = (
            self.session.query(ApuestaModel)
            .filter(ApuestaModel.usuario == usuario.id)
            .order_by(desc(ApuestaModel.fecha))
            .limit(20)
        )

        return [
            UltimaApuesta(
                monto=apuesta.monto,
                montoResultado=apuesta.montoResultado,
                porcentaje=apuesta.porcentaje,
                lado=apuesta.lado,
                fecha=datetime.strftime(apuesta.fecha, "%d/%m/%Y, %H:%M:%S"),
                resultado=apuesta.resultado,
            ).model_dump()
            for apuesta in apuestas
        ]

    def UltimosUsuarios(self):
        usuarios = self.session.query(UserModel).order_by(UserModel.id.desc()).limit(10)
        return [
            NuevoUsuario(avatar=user.avatar, username=user.username).model_dump()
            for user in usuarios
        ]


class Banco:
    def __init__(
        self,
        session: Session,
        user: UserModel = None,
        monto: float = 0.0,
    ):
        self.monto = monto
        self.session = session
        self.user = user

    def getQR(self):
        try:
            datos, status_code = NewCobropix(monto=self.monto).PIX()

            if not status_code in {200, 201}:
                raise ControllerException(
                    f"Error en la solicitud del QRPIX a Assas con status_code -> {status_code} -> {datos}"
                )

            self.guardaTransaccionInicial(idTransac=datos["id"])
            send_mensaje_telegram(
                mensaje=f"Pix Generado: Usuario: {self.user.username} - Valor: R$ {self.monto}"
            )
            return {
                "idQr": datos["id"],
                "encodedImage": datos["encodedImage"],
                "payload": datos["payload"],
                "expirationDate": datos["expirationDate"],
            }

        except ControllerException as ex:
            raise HTTPException(status_code=400, detail=str(ex))

        except Exception as ex:
            raise HTTPException(status_code=400, detail=str(ex))

    def guardaTransaccionInicial(self, idTransac: str):
        try:
            transaccion = TransacEntradaModel(
                usuarioTransaccion=self.user,
                idExterno=idTransac,
                monto=self.monto,
                fechaCreado=datetime_local_actual(),
            )
            self.session.add(transaccion)
            self.session.commit()
            self.session.refresh(transaccion)

        except Exception as ex:
            raise HTTPException(
                status_code=400, detail=f"Error al guarda la transaccion inicial {ex}"
            )

    def actualizaTransaccionEntrada(self, idTransac: str) -> None:
        try:
            transac = (
                self.session.query(TransacEntradaModel)
                .filter(
                    and_(
                        TransacEntradaModel.idExterno == idTransac,
                        TransacEntradaModel.monto == self.monto,
                    )
                )
                .first()
            )

            cant = (
                self.session.query(TransacEntradaModel)
                .filter(TransacEntradaModel.usuario == transac.usuario)
                .count()
            )

            if not transac:
                raise HTTPException(
                    status_code=400, detail="Monto invalido para actualizar"
                )
            transac.status = True
            transac.fechaPagado = datetime_local_actual()

            # validamos si es la primera transaccion y acresentamos el bono del primer deposito..
            if cant == 1:
                transac.usuarioTransaccion.account += (
                    (transac.monto * 2) if transac.monto <= 100 else transac.monto + 100
                )
            else:
                transac.usuarioTransaccion.account += transac.monto

            self.session.commit()
            send_mensaje_telegram(
                mensaje=f"Deposito Validado - Valor: R$ {transac.monto}"
            )
        except Exception as ex:
            self.session.rollback()
            raise HTTPException(
                status_code=400, detail=f"Error en actualizaTransaccionEntrada -> {ex}"
            )

        finally:
            self.session.close()

    def ObterTransaccionesGeral(self):
        TransEnt = (
            self.session.query(TransacEntradaModel)
            .filter(TransacEntradaModel.usuario == self.user.id)
            .limit(50)
            .all()
        )
        TransSal = (
            self.session.query(TransacSalidaModel)
            .filter(TransacSalidaModel.usuario == self.user.id)
            .limit(50)
            .all()
        )
        out = [
            TransaccionesBanco(
                **{
                    "id": transacc.id,
                    "idExterno": transacc.idExterno,
                    "tipo": "entrada",
                    "monto": transacc.monto,
                    "fechaCreado": transacc.fechaCreado,
                    "fechaPagado": transacc.fechaPagado,
                    "status": transacc.status,
                }
            )
            for transacc in TransEnt
        ] + [
            TransaccionesBanco(
                **{
                    "id": transacc.id,
                    "idExterno": transacc.idExterno
                    if transacc.idExterno != None
                    else "",
                    "tipo": "salida",
                    "monto": transacc.monto,
                    "fechaCreado": transacc.fechaCreado,
                    "fechaPagado": transacc.fechaPagado,
                    "status": transacc.status,
                }
            )
            for transacc in TransSal
        ]

        return sorted(out, key=(lambda obj: obj.fechaCreado), reverse=True)

    def retiroFondos(self, retiro: RetiroFondos):
        try:
            cuenta = (
                self.session.query(UserModel)
                .filter(UserModel.id == retiro.userId)
                .first()
            )

            if cuenta.ganancias < float(
                os.getenv("MONTO_MINIMO_RETIROS")
            ) or retiro.monto < float(os.getenv("MONTO_MINIMO_RETIROS")):
                raise ControllerException(
                    "Não possui o monto minimo R$50 de ganancias para saque - Atual: R$"
                    + cuenta.ganancias
                )

            if retiro.monto >= cuenta.ganancias:
                raise ControllerException("Saldo insuficiente para fazer o saque")

            # Crear transaccion de salida
            transaccSalida = TransacSalidaModel(
                usuarioTransaccion=self.user,
                monto=retiro.monto,
                tipoLlave=retiro.llaveTipo,
                llavePix=retiro.chavePix,
                fechaCreado=datetime_local_actual(),
                status=False,
            )
            self.session.add(transaccSalida)
            self.session.commit()
            self.session.refresh(transaccSalida)

            # Descontar monto de la cuenta
            cuenta = (
                self.session.query(UserModel)
                .filter(UserModel.id == self.user.id)
                .first()
            )

            cuenta.ganancias = cuenta.ganancias - retiro.monto
            self.session.commit()
            self.session.refresh(cuenta)
            send_mensaje_telegram(
                mensaje=f"Usuario {self.user.username} - Solicitou Saque no Valor de R$ {retiro.monto}"
            )
            # Sera desenvolvida depois no momento lo haremos manual
            # Llamar funcion que hace el pix
            # datos, status_code = NewTransferenciaPIX(
            #     retiro=retiro, usuario=self.user
            # ).enviarPix()

            # if status_code != 200:
            #     raise ControllerException("erro na conexão do banco para enviar pix")

            # # actualizamos el ID de la transaccion en la tabla
            # transaccSalida.idExterno = datos["id"]
            self.session.commit()
            self.session.refresh(transaccSalida)
            return Response(
                status_code=200,
            )

        except ControllerException as ex:
            self.session.rollback()
            raise HTTPException(status_code=400, detail=f"Erro en retiroFondos -> {ex}")

        except Exception as ex:
            self.session.rollback()
            raise HTTPException(status_code=400, detail=f"Error en retiroFondos {ex}")
        finally:
            self.session.close()

    def get_status_pix(self, idPix: str):
        if not (
            statusPix := self.session.scalar(
                select(TransacEntradaModel).where(
                    TransacEntradaModel.idExterno == idPix
                )
            )
        ):
            raise HTTPException(
                status_code=400,
                detail=StatusPix(error="transação pix não encontrada").model_dump(),
            )
        return StatusPix(idQr=statusPix.idExterno, status=statusPix.status).model_dump()
