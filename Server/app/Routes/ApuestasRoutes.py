from fastapi import Depends
from fastapi import APIRouter
from Schemas.Apuesta import Apuesta 
from Models.model import get_session
from sqlalchemy.orm import Session
from Controller.ApuestaController import ApuestaController
from Service.securtity import (get_current_user)
from Schemas.SchemaUser import ( User)

router = APIRouter()

@router.post("/HacerApuesta",status_code=200)
async def hacer_apuesta(novaApuesta: Apuesta, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    print(session!= None ,"Possiu sessao")
    return await ApuestaController(session).HacerApuesta(novaApuesta)
