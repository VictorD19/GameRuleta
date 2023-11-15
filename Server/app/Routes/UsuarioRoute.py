from fastapi import APIRouter, WebSocket
from Controller.UsuarioController import Usuario
router = APIRouter(prefix="/ws/Usuario")

@router.websocket("/HacerApuesta")
async def websocket_endpoint_status_salas(websocket: WebSocket):  
    await websocket.accept()
    usuarioController = Usuario(websocket)
    apuesaUsuario = await usuarioController.HacerApuesta()
    while True:
        await websocket.send_json({
            "mensage":"ApuestaRealizada",
            "Data": apuesaUsuario
        })