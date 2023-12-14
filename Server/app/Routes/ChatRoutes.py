import json
import asyncio
from fastapi import APIRouter, WebSocket

router = APIRouter()

mensagems = []


@router.websocket("/chat-general")
async def websocket_chat_general(websocket: WebSocket):
    global mensagems
    try:
        await websocket.accept()
        while True:
            await websocket.send_json(mensagems)

            mensaje = await websocket.receive_json()
            mensagems.insert(0, mensaje)
            mensagems = mensagems[0:50]
            await websocket.send_json(mensagems)
            await asyncio.sleep(1)
    except:
        await websocket.send_json(mensagems)
        await asyncio.sleep(1)
