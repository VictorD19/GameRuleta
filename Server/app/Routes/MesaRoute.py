from fastapi import APIRouter, WebSocket

router = APIRouter(prefix="/ws/Mesa")

@router.websocket("/")
async def websocket_endpoint_Mesa(websocket: WebSocket):
    await websocket.accept()
    while True:
        await websocket.send_text("mesasa")