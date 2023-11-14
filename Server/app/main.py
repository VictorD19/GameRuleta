from fastapi import FastAPI, WebSocket
import asyncio
import random
import string
from Controller.SalaController import SalasGeral

# Crea una instancia de FastAPI
app = FastAPI()


def generate_random_string():
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(10))


@app.websocket("/ws/status-salas")
async def websocket_endpoint_status_salas(websocket: WebSocket):
    await websocket.accept()
    while True:
        statusSalas = await SalasGeral().DadosGeraisSalas()
        await websocket.send_text(statusSalas)
        await asyncio.sleep(5)

# WebSocket endpoint para sala1
@app.websocket("/ws/sala1")
async def websocket_endpoint_sala1(websocket: WebSocket):
    await websocket.accept()
    while True:
        random_string = generate_random_string()
        await websocket.send_text(f"Test conexión WebSocket sala1: {random_string}")
        await asyncio.sleep(1)

# WebSocket endpoint para sala2
@app.websocket("/ws/sala2")
async def websocket_endpoint_sala2(websocket: WebSocket):
    await websocket.accept()
    while True:
        random_string = generate_random_string()
        await websocket.send_text(f"Test conexión WebSocket sala2: {random_string}")
        await asyncio.sleep(1)

# WebSocket endpoint para sala3
@app.websocket("/ws/sala3")
async def websocket_endpoint_sala3(websocket: WebSocket):
    await websocket.accept()
    while True:
        random_string = generate_random_string()
        await websocket.send_text(f"Test conexión WebSocket sala3: {random_string}")
        await asyncio.sleep(1)

