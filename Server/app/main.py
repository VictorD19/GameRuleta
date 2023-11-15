from fastapi import FastAPI, WebSocket
from Controller.SalaController import SalasGeral
from Routes.user_routes import router as user_router
import asyncio
import random
import string
from fastapi import FastAPI
from Routes import RouteMain

# Crea una instancia de FastAPI
app = FastAPI()
app.include_router(user_router, prefix='/user')


app.include_router(RouteMain.Routes["MesaRoute"])
app.include_router(RouteMain.Routes["SalaRoute"])
app.include_router(RouteMain.Routes["UsuarioRoute"])
