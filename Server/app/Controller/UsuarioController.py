from fastapi import Depends, WebSocket, HTTPException
from sqlalchemy import or_, and_
from sqlalchemy.orm import joinedload

# from Models.Apuesta import Apuesta
from Service.APIAsaasService import NewCobropix
from Schemas.Exection import ControllerException
from Schemas.SchemaUser import UserPublic, TransaccionesBanco
from Models.model import (
    Session,
    get_session,
    TransacEntradaModel,
    UserModel,
    TransacSalidaModel,
)
from datetime import datetime


class Usuario:
    def __init__(self, webSocket: WebSocket):
        self.WebSocket = webSocket

    def ObterApuestaUsuario(self):
        apuestaUsuario = Apuesta
        print(self)
        # apuestaUsuario.IdUsuario = self.WebSocket.query_params["IdUsuario"]
        # apuestaUsuario.IdLadoApostado = self.WebSocket.query_params["IdLadoApostado"]
        # apuestaUsuario.ValorApostado = self.WebSocket.query_params["ValorApostado"]
        return apuestaUsuario

    async def HacerApuesta(self):
        apuestaUsuario = self.ObterApuestaUsuario()
        return json.dumps({"Apuesta": "qasas"})


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

            return {
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
                fechaCreado=datetime.now(),
            )
            self.session.add(transaccion)
            self.session.commit()
            self.session.refresh(transaccion)

        except Exception as ex:
            raise HTTPException(
                status_code=400, detail=f"Error al guarda la transaccion inicial {ex}"
            )

    def actualizaTransaccionEntrada(self, idTransac: str) -> None:
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

        if not transac:
            raise HTTPException(
                status_code=400, detail="Monto invalido para actualizar"
            )

        transac.status = True
        transac.fechaPagado = datetime.now()
        self.session.commit()
        self.session.refresh(transac)

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
                    "idExterno": transacc.idExterno,
                    "tipo": "salida",
                    "monto": transacc.monto,
                    "fechaCreado": transacc.fechaCreado,
                    "fechaPagado": transacc.fechaPagado,
                    "status": transacc.status,
                }
            )
            for transacc in TransSal
        ]

        return sorted(out, key=(lambda t: t.fechaCreado), reverse=True)
