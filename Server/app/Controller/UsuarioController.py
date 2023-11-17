from fastapi import WebSocket
#from Models.Apuesta import Apuesta
from Service.APIAsaasService import NewCobropix

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

        datos = NewCobropix(monto=self.monto).PIX()

        if datos:
            return { 'encodedImage': datos['encodedImage'],
                     'payload':datos['payload'],
                     'expirationDate' :datos['expirationDate']}
                        