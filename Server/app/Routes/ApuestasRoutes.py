from fastapi import HTTPException, Depends
from fastapi import APIRouter
from Schemas.Apuesta import Apuesta
from Models.model import get_session
from sqlalchemy.orm import Session
from Controller.ApuestaController import ApuestaController
from Service.securtity import get_current_user
from Schemas.SchemaUser import User

router = APIRouter()


@router.post("/hacer-apuesta/", status_code=200)
def hacer_apuesta(
    novaApuesta: Apuesta,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != novaApuesta.IdUsuario:
        raise HTTPException(status_code=401, detail="Usuario não autorizado.")

    return ApuestaController(session, current_user, apuesta=novaApuesta).hacerApuesta()
