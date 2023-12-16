import json
import asyncio
from fastapi import APIRouter, WebSocket

router = APIRouter()

mensagems = []


@router.websocket("/chat-general")
async def websocket_chat_general(websocket: WebSocket):
    
    global mensagems

    await websocket.accept()  

    while True:       
         
        try:
            mensaje = await asyncio.wait_for(websocket.receive_text(), timeout=1.0)
        except Exception:
            mensaje = None

        if mensaje:       
            mensagems.append(json.loads(mensaje))
            mensagems = mensagems[0:50]          
        await websocket.send_json(mensagems)
        await asyncio.sleep(1)
