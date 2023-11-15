import asyncio
from fastapi import APIRouter, WebSocket
from app.Controller.ChatController import GetChatController

router = APIRouter()

@router.websocket("/chat-general")
async def websocket_endpoint_status_salas(websocket: WebSocket):
    await websocket.accept()    
    while True:        
        mensaje = await websocket.receive_json()
        await websocket.send_json(mensaje)
        await asyncio.sleep(0.5)