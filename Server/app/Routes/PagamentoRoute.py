from fastapi import HTTPException, Depends
from fastapi import APIRouter
from Schemas.Apuesta import Apuesta
from Models.model import get_session, TransacSalidaModel
from sqlalchemy.orm import Session
from sqlalchemy import Select, and_
from Service.securtity import get_current_user
from Schemas.SchemaUser import User, TransaccionesBanco
from datetime import datetime

router = APIRouter()


@router.get("/pagamentos-pendiente/")
def pagamentos_pendentes(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    if current_user.usuarioAdministrador != True:
        raise HTTPException(status_code=401, detail="Usuario não autorizado.")

    TransSal = (
        session.query(TransacSalidaModel)
        .filter(TransacSalidaModel.fechaPagado == None)
        .limit(50)
        .all()
    )
    return [
        TransaccionesBanco(
            **{
                "id": transacc.id,
                "idExterno": transacc.idExterno,
                "tipo": "entrada",
                "monto": transacc.monto,
                "fechaCreado": transacc.fechaCreado,
                "fechaPagado": transacc.fechaPagado,
                "status": transacc.status,
            }
        )
        for transacc in TransSal
    ]


@router.post("/confirmar-pagamento/{id}", status_code=200)
def confirmar_pagamento(
    id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    if current_user.usuarioAdministrador != True:
        raise HTTPException(status_code=401, detail="Usuario não autorizado.")

    if not (TransSal := (
        session.query(TransacSalidaModel)
        .filter(
            and_(
                TransacSalidaModel.id == id,
                TransacSalidaModel.fechaPagado == None,
                TransacSalidaModel.status == False,
            )
        )
        .first()
    )):
        raise HTTPException(
            status_code=400,
            detail="Transação Não encontrada para pagamento ou ja foi realizado o pagamento da mesma",
        )


    TransSal.fechaPagado = datetime.now()
    TransSal.status = True

    session.commit()
    session.refresh(TransSal)
    return


@router.post("/cancelar-pagamento/{id}", status_code=200)
def cancelar_pagamento(
    id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    if current_user.usuarioAdministrador != True:
        raise HTTPException(status_code=401, detail="Usuario não autorizado.")

    if not (TransSal := (
        session.query(TransacSalidaModel)
        .filter(TransacSalidaModel.id == id)
        .first()
    )):
        raise HTTPException(
            status_code=400,
            detail="Transação Não encontrada para pagamento ou ja foi realizado o pagamento da mesma",
        )
   
    TransSal.status = False

    session.commit()
    session.refresh(TransSal)
    return
