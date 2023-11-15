from fastapi import FastAPI
from Server.app.Routes.UserRoutes import router as user_router
from Server.app.Routes.MesasRoutes import router as mesas_router
from Server.app.Routes.ChatRoutes import router as chat_router
from Server.app.Routes.ApuestasRoutes import router as apuesta_router
from fastapi import FastAPI
from Routes import RouteMain

# Crea una instancia de FastAPI
app = FastAPI()
app.include_router(user_router, prefix='/user')
app.include_router(mesas_router, prefix='/mesas')
app.include_router(chat_router, prefix='/chat')
app.include_router(apuesta_router, prefix='/apuestas')

