from fastapi import WebSocket, HTTPException

# from Models.Apuesta import Apuesta
from Service.APIAsaasService import NewCobropix
from Schemas.Exection import ControllerException
from Schemas.SchemaUser import UserPublic
from Models.model import Session, TransacEntradaModel
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
    def __init__(self, session: Session, user: int, monto: float = 0.0):
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
