from fastapi import FastAPI
from Routes import RouteMain

# Crea una instancia de FastAPI
app = FastAPI()

app.include_router(RouteMain.Routes["MesaRoute"])
app.include_router(RouteMain.Routes["SalaRoute"])
app.include_router(RouteMain.Routes["UsuarioRoute"])
