import asyncio
import json
from fastapi import APIRouter, WebSocket
from fastapi import Depends, HTTPException
from Controller.MesaController import SalasGeral
from Models.model import Session, get_session

router = APIRouter()
# prefix='/mesas'apuesta

@router.websocket("/status-mesas")
async def websocket_endpoint_status_salas(websocket: WebSocket, session: Session = Depends(get_session)):
    await websocket.accept()
    while True:
        statusMesas = await SalasGeral(session).DadosGeraisSalas()       
        await websocket.send_json(statusMesas)
        await asyncio.sleep(5)


# WebSocket endpoint para sala1
@router.websocket("/{idMesa}")
async def websocket_endpoint_sala1(websocket: WebSocket):
    await websocket.accept()
    while True:        
        await websocket.send_text(f"Test conexión WebSocket sala1:")
        await asyncio.sleep(1)
