import asyncio
import random
import string
from fastapi import APIRouter, WebSocket
from Controller.SalaController import SalasGeral

router = APIRouter(prefix="/ws/Salas")


def generate_random_string():
    return "".join(
        random.choice(string.ascii_uppercase + string.digits) for _ in range(10)
    )


@router.websocket("/status-salas")
async def websocket_endpoint_status_salas(websocket: WebSocket):
    await websocket.accept()
    while True:
        await websocket.send_text(await SalasGeral().DadosGeraisSalas())
        await asyncio.sleep(5)


# WebSocket endpoint para sala1
@router.websocket("/Sala/{idSala}")
async def websocket_endpoint_sala1(websocket: WebSocket):
    await websocket.accept()
    while True:
        random_string = generate_random_string()
        await websocket.send_text(f"Test conexión WebSocket sala1: {random_string}")
        await asyncio.sleep(1)
