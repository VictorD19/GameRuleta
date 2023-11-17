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

            if status_code != 200:
                raise ControllerException("Não foi possivel gerar o pix")

            return { 'encodedImage': datos['encodedImage'],
                        'payload':datos['payload'],
                        'expirationDate' :datos['expirationDate']}
       
        except ControllerException as ex:
            raise HTTPException(status_code=400,detail=str(ex))
        
        except Exepcion as ex:
            raise HTTPException(status_code=400,detail=str(ex))


