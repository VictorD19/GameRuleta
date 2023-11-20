import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, WebSocketException
from fastapi import Depends, HTTPException
from Controller.MesaController import SalasGeral
from Models.model import Session, get_session
import json

router = APIRouter()
# prefix='/mesas'apuesta

conexiones_activas = {}

async def notify_clients(message: json):
    for connection_id, websocket in conexiones_activas.items():
        try:
            await websocket.send_json(message)
        except WebSocketDisconnect:
            # Manejar desconexiones inesperadas de clientes durante el envío
            print(f"Cliente {connection_id} se ha desconectado de manera inesperada durante el envío.")
        except Exception as e:
            # Manejar otros errores de envío
            print(f"Error al enviar mensaje a {connection_id}: {e}")



@router.websocket("/status-mesas/{id_mesa}")
async def websocket_endpoint_status_salas(
    id_mesa :int,
    websocket: WebSocket, session: Session = Depends(get_session)
):  
    await websocket.accept()
    user_id = str(id(websocket))
    conexiones_activas[user_id] = websocket        
    
    try:
        while True:
            out = {}
            out['estatusGeral'] = await SalasGeral(session).DadosGeraisSalas()
                        
            if id_mesa != 0:
                out['statusMesas'] = await SalasGeral(session).ObterDadosMesaPorId(id_mesa)

            
            await websocket.send_json(out)        
            asyncio.sleep(1)

    except WebSocketDisconnect as ex:        
        print(f"El usuario:{user_id} se ha desconectado de manera inesperada durante el envío, Erro -> {ex}")
    except WebSocketException as ex:        
        print(f"El usuario:{user_id} se ha desconectado de manera inesperada durante el envío, Erro -> {ex}")
    except Exception as ex:
        print(f"El usuario:{user_id} se ha desconectado de manera inesperada durante el envío, Erro -> {ex}")
        
    finally:
        conexiones_activas.pop(user_id)
        await notify_clients(f"Cliente {user_id} se ha desconectado de manera inesperada durante el envío.")







"""
@router.websocket("/status-mesas")
async def websocket_endpoint_status_salas(
    websocket: WebSocket, session: Session = Depends(get_session)
):
    await websocket.accept()
    while True:
        statusMesas = await SalasGeral(session).DadosGeraisSalas()
        await websocket.send_json(statusMesas)
        await asyncio.sleep(5)


# WebSocket endpoint para sala1
@router.websocket("/{idMesa}")
async def websocket_endpoint_sala1(
    websocket: WebSocket, session: Session = Depends(get_session)
):
    await websocket.accept()
    while True:
        await websocket.send_text(
            await SalasGeral(session).ObterDadosMesaPorId(
                int(websocket.path_params["idMesa"])
            )
        )
"""
