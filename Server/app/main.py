from fastapi import FastAPI, BackgroundTasks
from Routes.UserRoutes import router as user_router
from Routes.MesasRoutes import router as mesas_router
from Routes.ChatRoutes import router as chat_router
from Routes.ApuestasRoutes import router as apuesta_router
from Routes.PagamentoRoute import router as pagamento_router
from Routes.Minasroutes import router as minas_router
from fastapi.middleware.cors import CORSMiddleware
from Service.APIAsaasService import NewTransferenciaPIX
from Models.model import Session, engine, UserModel
from Schemas.SchemaUser import RetiroFondos
from dotenv import load_dotenv
import os
import asyncio

load_dotenv()

app = FastAPI()
# from socketServer import socketApp
origins = [
    "https://funcombat.online",
    "https://www.funcombat.online",
    "http://funcombat.online",
    "http://www.funcombat.online",
    "http://localhost:3000",
]
# Crea una instancia de FastAPI


async def tranferenciaSaldoCasa():
    session = Session(engine)  ##Usuario Administrador 26
    try:
        administrador = session.query(UserModel).filter(UserModel.id == 26).first()

        if administrador.ganancias < 50:
            return

        nuevoRetiro = RetiroFondos(
            chavePix=os.getenv("CHAVE_CASA"),
            monto=administrador.ganancias,
            userId=administrador.id,
            llaveTipo=os.getenv("CHAVE_CASA_TIPO"),
        )
        _, status_code = NewTransferenciaPIX(
            retiro=nuevoRetiro, usuario=administrador
        ).enviarPix()

        if status_code in {200, 201}:
            administrador.ganancias = 0
            session.commit()
            session.refresh(administrador)

    except Exception as ex:
        session.rollback()


async def periodic_task():
    while True:
        await tranferenciaSaldoCasa()
        await asyncio.sleep(60)


async def startup_event():
    asyncio.create_task(periodic_task())


# app.mount("/ws", socketApp)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(user_router, prefix="/api/user")
app.include_router(mesas_router, prefix="/api/mesas")
app.include_router(pagamento_router, prefix="/api/pagamento")
app.include_router(chat_router, prefix="/api/chat")
app.include_router(apuesta_router, prefix="/api/apuestas")
app.include_router(minas_router, prefix="/api/minas")


app.add_event_handler("startup", startup_event)
