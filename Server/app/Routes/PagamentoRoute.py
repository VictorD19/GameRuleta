from fastapi import HTTPException, Depends
from fastapi import APIRouter
from Schemas.Apuesta import Apuesta
from Models.model import get_session, TransacSalidaModel
from sqlalchemy.orm import Session
from sqlalchemy import Select, and_
from Service.securtity import get_current_user
from Schemas.SchemaUser import User, TransaccionPagada, TransaccionesBanco
from datetime import datetime
from random import randint

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

    if not (
        TransSal := (
            session.query(TransacSalidaModel)
            .filter(
                and_(
                    TransacSalidaModel.id == id,
                    TransacSalidaModel.fechaPagado == None,
                    TransacSalidaModel.status == False,
                )
            )
            .first()
        )
    ):
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

    if not (
        TransSal := (
            session.query(TransacSalidaModel)
            .filter(TransacSalidaModel.id == id)
            .first()
        )
    ):
        raise HTTPException(
            status_code=400,
            detail="Transação Não encontrada para pagamento ou ja foi realizado o pagamento da mesma",
        )

    TransSal.status = False

    session.commit()
    session.refresh(TransSal)
    return


@router.get("/pagamentos-realizados/")
def pagamentos_pendentes(session: Session = Depends(get_session)):
    TransSal = (
        session.query(TransacSalidaModel)
        .filter(TransacSalidaModel.fechaPagado != None)
        .limit(10)
        .all()
    )
    saida = [
        TransaccionPagada(
            **{
                "id": transacc.id,
                "tipo": "PIX",
                "chavePix": transacc.llavePix,
                "monto": transacc.monto,
                "usuario": transacc.usuarioTransaccion.username,
                "avatar": transacc.usuarioTransaccion.avatar,
            }
        )
        for transacc in TransSal
    ]

    if len(saida) > 10:
        return saida

    usuariosFixos = [
        {"username": "Canserbero", "avatar": "Profile3", "chavePix": "1584********01"},
        {"username": "VictorD123", "avatar": "Profile8", "chavePix": "9263********12"},
        {
            "username": "GrandeMestre12",
            "avatar": "Profile4",
            "chavePix": "7351********78",
        },
        {"username": "domcamacdo", "avatar": "Profile13", "chavePix": "6482********34"},
        {"username": "Mariposa", "avatar": "Profile8", "chavePix": "5029********90"},
        {
            "username": "VenturaX",
            "avatar": "Profile12",
            "chavePix": "mari****@gmail.com",
        },
        {
            "username": "Nebuloso23",
            "avatar": "Profile5",
            "chavePix": "vent****@hotmail.com",
        },
        {
            "username": "RaiodeSol",
            "avatar": "Profile10",
            "chavePix": "raio****@gmail.com",
        },
        {
            "username": "Espectro13",
            "avatar": "Profile1",
            "chavePix": "mario***@gmail.com",
        },
        {
            "username": "LuarAzul",
            "avatar": "Profile7",
            "chavePix": "luar****@gmail.com",
        },
        {
            "username": "Tempestade44",
            "avatar": "Profile14",
            "chavePix": "luisP**@gmail.com",
        },
        {"username": "Serpente88", "avatar": "Profile2", "chavePix": "7631********56"},
        {"username": "Aurora71", "avatar": "Profile11", "chavePix": "1584********01"},
        {"username": "Fogueteiro", "avatar": "Profile6", "chavePix": "6290********78"},
    ]

    for x in range(1, 9):
        user = usuariosFixos[randint(0, 13)]
        saida.append(
            TransaccionPagada(
                **{
                    "id": randint(1, 100),
                    "tipo": "PIX",
                    "monto": randint(50, 350),
                    "usuario": user.get("username"),
                    "avatar": user.get("avatar"),
                    "chavePix": user.get("chavePix"),
                }
            )
        )

    return saida
