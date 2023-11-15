import asyncio
import random
import string
from fastapi import APIRouter, WebSocket
from Controller.SalaController import SalasGeral

router = APIRouter()

@router.websocket("/status-mesas")
async def websocket_endpoint_status_salas(websocket: WebSocket):
    await websocket.accept()
    while True:
        await websocket.send_text(await SalasGeral().DadosGeraisSalas())
        await asyncio.sleep(5)


# WebSocket endpoint para sala1
@router.websocket("/{idMesa}")
async def websocket_endpoint_sala1(websocket: WebSocket):
    await websocket.accept()
    while True:        
        await websocket.send_text(f"Test conexión WebSocket sala1:")
        await asyncio.sleep(1)
