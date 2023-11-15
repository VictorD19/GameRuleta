from fastapi import WebSocket
#from Models.Apuesta import Apuesta


class Usuario:
    def __init__(self, webSocket: WebSocket):
        self.WebSocket = webSocket

    async def HacerApuesta():
        apuestaUsuario =await ObterApuestaUsuario()
        
        return apuestaUsuario

    def ObterApuestaUsuario():
        apuestaUsuario: Apuesta = Apuesta()
        apuestaUsuario.IdUsuario = self.Websocket.path_params["IdUsuario"]
        apuestaUsuario.IdLadoApostado = self.Websocket.path_params["IdLadoApostado"]
        apuestaUsuario.ValorApostado = self.Websocket.path_params["ValorApostado"]
        return apuestaUsuario
