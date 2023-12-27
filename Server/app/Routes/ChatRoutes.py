import json
import asyncio
from fastapi import APIRouter, WebSocket

router = APIRouter()

message_queue = asyncio.Queue(maxsize=50)
@router.websocket("/chat-general")
async def websocket_chat_general(websocket: WebSocket):
    await websocket.accept()

    while True:
        try:
            mensaje = await asyncio.wait_for(websocket.receive_text(), timeout=1.0)
        except Exception:
            mensaje = None

        if mensaje:
            message_data = json.loads(mensaje)
            await message_queue.put(message_data)

        messages_to_send = []
        while not message_queue.empty():
            message = await message_queue.get()
            messages_to_send.append(message)

        if messages_to_send:
            await websocket.send_json(messages_to_send)

        await asyncio.sleep(1)
