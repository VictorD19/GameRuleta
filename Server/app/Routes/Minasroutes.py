from dotenv import load_dotenv
from fastapi import Depends, HTTPException, Response, Request
from fastapi.responses import JSONResponse
from fastapi import APIRouter
from Service.securtity import get_current_user
from Schemas.SchemaUser import User
from Schemas.MinasSchema import MinasApuesta
from Controller.MinasController import MinasController
from Models.model import get_session, UserModel
from sqlalchemy.orm import Session

load_dotenv()
router = APIRouter()


@router.post("/new-mines/{user_id}")
def new_mines(
    user_id: int,
    minas_apuesta: MinasApuesta,
    session: Session = Depends(get_session),
    current_user: UserModel = Depends(get_current_user),
):
    if current_user.id != user_id:
        raise HTTPException(status_code=400, detail="Permissões insuficientes")

    if minas_apuesta.monto > (current_user.account + current_user.ganancias):
        raise HTTPException(status_code=400, detail="Saldo Insuficiente.")

    apuesta = MinasController(
        minas_apuesta=minas_apuesta, session=session, user=current_user
    ).crea_jugada_minas()

    if apuesta:
        return JSONResponse(status_code=201, content={"ok": "ok"})
