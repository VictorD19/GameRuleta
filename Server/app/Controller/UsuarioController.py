from fastapi import WebSocket,HTTPException
#from Models.Apuesta import Apuesta
from Service.APIAsaasService import NewCobropix
from Schemas.Exection import  ControllerException

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
        return json.dumps({
           "Apuesta":"qasas"
        })


class Banco:

    def __init__(self, monto) -> None:
        self.monto = monto
    
    def getQR(self):

        try:
            datos, status_code = NewCobropix(monto=self.monto).PIX()

            if not status_code in {200, 201}:
                raise ControllerException(
                    f"Error en la solicitud del QRPIX a Assas con status_code -> {status_code} -> {datos}"
                    )

            return {'encodedImage': datos['encodedImage'],
                    'payload':datos['payload'],
                    'expirationDate' :datos['expirationDate']}
       
        except ControllerException as ex:
            return HTTPException(status_code=400,detail=str(ex))
        
        except Exception as ex:
            return HTTPException(status_code=400,detail=str(ex))

    def guardaTransaccionInicial(self,  transacion : str):
        ...


