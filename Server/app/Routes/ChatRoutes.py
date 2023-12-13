import asyncio
from fastapi import APIRouter, WebSocket

router = APIRouter()

mensagems = []


@router.websocket("/chat-general")
async def websocket_chat_general(websocket: WebSocket):
    await websocket.accept()    
    while True:        
        mensaje = await websocket.receive_text()
        mensagems.insert(0, mensaje)
        mensagems = mensagems[0:50]
        await websocket.send_json(mensagems)
        await asyncio.sleep(1)
