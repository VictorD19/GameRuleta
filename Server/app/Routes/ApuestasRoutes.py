from fastapi import Depends
from fastapi import APIRouter
from Schemas.Apuesta import Apuesta 
from Models.model import get_session
from sqlalchemy.orm import Session
from Controller.ApuestaController import ApuestaController

router = APIRouter()

@router.post("/HacerApuesta",status_code=200)
async def hacer_apuesta(novaApuesta: Apuesta,session: Session = Depends(get_session)):
    return await ApuestaController(session).HacerApuesta(novaApuesta)
