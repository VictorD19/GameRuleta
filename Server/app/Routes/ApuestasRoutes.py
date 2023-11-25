from fastapi import Depends
from fastapi import APIRouter
from Schemas.Apuesta import Apuesta
from Models.model import get_session
from sqlalchemy.orm import Session
from Controller.ApuestaController import ApuestaController
from Service.securtity import get_current_user
from Schemas.SchemaUser import User

router = APIRouter()


@router.post("/HacerApuesta", status_code=200)
async def hacer_apuesta(
    novaApuesta: Apuesta,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return await ApuestaController(session, current_user).HacerApuesta(novaApuesta)


@router.post("/GenerarPartida", status_code=200)
async def hacer_apuesta(session: Session = Depends(get_session)):
    return await ApuestaController(session).GenerarPartida()
