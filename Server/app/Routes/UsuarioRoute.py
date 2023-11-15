from fastapi import APIRouter, WebSocket
from Controller import UsuarioController
router = APIRouter(prefix="/ws/Usuario")

@router.websocket("/HacerApuesta")
async def websocket_endpoint_hacer_apuesta(websocket: WebSocket):  
    await websocket.accept()
    usuarioController =  UsuarioController.Usuario(websocket)
    apuesaUsuario = await usuarioController.HacerApuesta()
    while True:
        await websocket.send_text(apuesaUsuario)