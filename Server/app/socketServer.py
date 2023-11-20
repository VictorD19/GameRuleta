from Models.model import Session, get_session
from fastapi import Depends
from Controller.MesaController import SalasGeral

#import socketio

socketServer = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
socketApp = socketio.ASGIApp(socketServer)


def HacerApuesta():
    print("Hizo un apuesata")


def EntrouSala(arg):
    print("Hizo un apuesata")


@socketServer.event
async def connect(sioid, env, auth):
    print("Cliente conectado al servicos", sioid)
    print("Cliente entro en las salas")
    socketServer.enter_room(sioid, "Salas")

    socketServer.on("Apuesta", HacerApuesta)
    socketServer.on("EntrouSala", EntrouSala)
    socketServer.emit("DadosSala", {"sala", "asd"})


@socketServer.event
async def disconnect(sockedId, env, auth):
    socketServer.leave_room(sockedId, "Salas")


# @socketServer.on("dados_da_sala")
# async def dados_da_sala(args, session: Session = Depends(get_session)):
#     statusMesas = await SalasGeral(session).DadosGeraisSalas()
#     socketServer.send(statusMesas, room="Salas")
