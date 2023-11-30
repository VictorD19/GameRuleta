import asyncio
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, WebSocketException
from fastapi import Depends, HTTPException
from Controller.MesaController import SalasGeral
from Models.model import (
    Session,
    get_session,
    UserModel,
    TransacSalidaModel,
    JugadaModel,
)
from Schemas.Mesas import EstadisticaJuego

router = APIRouter()
# prefix='/mesas'apuesta

conexiones_activas = {}


async def notify_clients(message: json):
    for connection_id, websocket in conexiones_activas.items():
        try:
            await websocket.send_json(message)
        except WebSocketDisconnect:
            # Manejar desconexiones inesperadas de clientes durante el envío
            print(
                f"Cliente {connection_id} se ha desconectado de manera inesperada durante el envío."
            )
        except Exception as e:
            # Manejar otros errores de envío
            print(f"Error al enviar mensaje a {connection_id}: {e}")


@router.websocket("/status-mesas/{id_mesa}")
async def websocket_endpoint_status_salas(
    websocket: WebSocket, id_mesa: int = 0, session: Session = Depends(get_session)
):
    await websocket.accept()
    user_id = str(id(websocket))
    conexiones_activas[user_id] = websocket

    try:
        while True:
            out = {}
            out["estatusGeral"] = await SalasGeral(session).DadosGeraisSalas()

            if id_mesa != 0:
                await SalasGeral(session).CheckStatusMesa(id_mesa)
                datosMesa = await SalasGeral(session).ObterDadosMesaPorId(id_mesa)
                out["statusMesas"] = datosMesa.model_dump()

            await websocket.send_json(out)
            await asyncio.sleep(1)

    except WebSocketDisconnect as ex:
        print(
            f"..El usuario:{user_id} se ha desconectado de manera inesperada durante el envío, Erro -> {ex}"
        )
    except WebSocketException as ex:
        print(
            f"El usuario:{user_id} se ha desconectado de manera inesperada durante el envío, Erro -> {ex}"
        )
    except Exception as ex:
        print(
            f".El usuario:{user_id} se ha desconectado de manera inesperada durante el envío, Erro -> {ex}"
        )

    finally:
        conexiones_activas.pop(user_id)
        await notify_clients(
            f"Cliente {user_id} se ha desconectado de manera inesperada durante el envío."
        )


@router.get(path="/estadisticas/", status_code=200, response_model=EstadisticaJuego)
def estadisticas(session: Session = Depends(get_session)):
    jugadoresActivos = len(conexiones_activas.keys())
    totalJugadores = session.query(UserModel).count()
    totalPagado = sum(
        [
            tranSalida.monto if tranSalida else 0
            for tranSalida in session.query(TransacSalidaModel).all()
        ]
    )

    totalJuegosRealizados = session.query(JugadaModel).count()

    return {
        "jugadoresActivos": jugadoresActivos,
        "totalJugadores": totalJugadores,
        "totalPagado": totalPagado,
        "totalJuegosRealizados": totalJuegosRealizados,
    }
