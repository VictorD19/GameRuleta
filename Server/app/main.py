from fastapi import FastAPI
from Routes.UserRoutes import router as user_router
from Routes.MesasRoutes import router as mesas_router
from Routes.ChatRoutes import router as chat_router
from Routes.ApuestasRoutes import router as apuesta_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
app = FastAPI()
#from socketServer import socketApp
origins = [
    "https://funcombat.online",
    "https://www.funcombat.online",
    "http://funcombat.online",
    "http://www.funcombat.online",
    "http://localhost:3000"
]
# Crea una instancia de FastAPI

#app.mount("/ws", socketApp)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(user_router, prefix="/api/user")
app.include_router(mesas_router, prefix="/api/mesas")
app.include_router(chat_router, prefix="/api/chat")
app.include_router(apuesta_router, prefix="/api/apuestas")
