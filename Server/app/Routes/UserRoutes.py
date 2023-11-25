from dotenv import load_dotenv
from fastapi import Depends, HTTPException, Response
from fastapi import APIRouter, Header
from sqlalchemy.orm import Session
from datetime import datetime
from random import randint
from sqlalchemy import select
from Schemas.SchemaUser import (
    UserPublic,
    User,
    UserUpdate,
    Token,
    QrPix,
    ListTransaccionesBanco,
    RetiroFondos,
    UserEmail,
)
from Schemas.SchemaWebhooks import PaymentEvent
from Models.model import get_session, UserModel, TransacEntradaModel
from Service.securtity import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
)
from Controller.UsuarioController import Banco, Usuario
import os

load_dotenv()
router = APIRouter()


@router.get("/get/{user_id}", response_model=UserPublic)
def read_user(
    user_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != user_id:
        raise HTTPException(status_code=400, detail="Permissões insuficientes")

    db_user = session.scalar(select(UserModel).where(UserModel.id == user_id))

    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    saldo = db_user.account + db_user.ganancias
    user = UserPublic(
        saldo=saldo,
        username=db_user.username,
        avatar=db_user.avatar,
        id=db_user.id,
        dataCriacion=db_user.dataCriacion,
        status=True,
    )
    return user


@router.post("/create-user/", response_model=UserPublic, status_code=201)
def create_user(user: User, session: Session = Depends(get_session)):
    db_user = session.scalar(
        select(UserModel).where(UserModel.username == user.username)
    )

    if db_user:
        raise HTTPException(status_code=400, detail="Nome de usuario ja esta em uso")

    usuarioQueIndicou = session.scalar(
        select(UserModel).where(UserModel.codIndicacion == user.codReferencia)
    )
    ##Indicação Precisa ser visto de nuevo
    if usuarioQueIndicou != None:
        valorBonus = os.getenv("QUANTIDADE_BONUS")
        if valorBonus != None and valorBonus > 0:
            usuarioQueIndicou.ganancias += valorBonus
            novaTransacion = TransacEntradaModel(
                usuario=usuarioQueIndicou.id,
                monto=valorBonus,
                status=True,
                fechaCreado=datetime.now(),
                fechaPagado=datetime.now(),
            )
            session.add(novaTransacion)
            session.commit()

    hashed_password = get_password_hash(user.password)

    db_user = UserModel(
        username=user.username,
        password=hashed_password,
        avatar=user.avatar,
        account=0.0,
        ganancias=0.0,
        dataCriacion=datetime.now(),
        codIndicacion=f"{user.username}{randint(1,299)}",
        codreferencia=user.codReferencia,
        email=user.email,
        status=True,
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    user = UserPublic(
        saldo=0.0,
        username=user.username,
        avatar=user.avatar,
        id=db_user.id,
        dataCriacion=db_user.dataCriacion,
        status=True,
    )

    return user


@router.patch("/update/{user_id}", response_model=UserPublic)
def update_user(
    user_id: int,
    user: UserUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != user_id:
        raise HTTPException(status_code=400, detail="Permissões insuficientes")

    db_user = session.scalar(select(UserModel).where(UserModel.id == user_id))

    if db_user is None:
        raise HTTPException(status_code=404, detail="Usuario não encontrado")

    if user.username:
        db_user.username = user.username

    if user.password:
        db_user.password = get_password_hash(user.password)

    if user.avatar:
        db_user.avatar = user.avatar

    session.commit()
    session.refresh(db_user)
    return db_user


@router.post("/login/", response_model=Token)
def login_for_access_token(user: User, session: Session = Depends(get_session)):
    userdb = session.scalar(
        select(UserModel).where(UserModel.username == user.username)
    )

    if not userdb:
        raise HTTPException(status_code=400, detail="Usuario ou senha incorretos")

    if not verify_password(
        user.password,
        userdb.password,
    ):
        raise HTTPException(status_code=400, detail="Usuario ou senha incorretos")
    access_token = create_access_token(data={"id": userdb.id})

    if not access_token:
        raise HTTPException(status_code=400, detail="No fue posible obtener un token")
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/refresh_token/", response_model=Token)
def refresh_access_token(user: User = Depends(get_current_user)):
    new_access_token = create_access_token(data={"id": user.id})
    if not new_access_token:
        raise HTTPException(
            status_code=400, detail="No fue posible obtener un refresh_token"
        )
    return {"access_token": new_access_token, "token_type": "bearer"}


@router.get("/new-cobro-pix/{user_id}/{monto}/", response_model=QrPix)
def newCobroPix(
    user_id: int, monto: float, current_user: User = Depends(get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=400, detail="Permissões insuficientes")

    return Banco(monto=monto, user=current_user).getQR()


@router.post("/webhook-asaas/", status_code=200)
def webhookAsaas(
    event: PaymentEvent,
    asaaS_access_token: str = Header(..., convert_underscores=False),
    session: Session = Depends(get_session),
):
    if not asaaS_access_token or asaaS_access_token != os.getenv("WEBHOOK_TOKEN_ASAAS"):
        raise HTTPException(
            status_code=400,
            detail="Encabezado HTTP_ASAAS_ACCESS_TOKEN no proporcionado",
        )
    if event.event == "PAYMENT_CREATED":
        ...

    if event.event == "PAYMENT_RECEIVED" and event.payment.billingType == "PIX":
        Banco(
            monto=float(event.payment.value), session=session
        ).actualizaTransaccionEntrada(idTransac=event.payment.pixQrCodeId)

    return Response(status_code=200)


@router.get(
    "/transac/{user_id}/", status_code=200, response_model=ListTransaccionesBanco
)
def obterTransacciones(
    user_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != user_id:
        raise HTTPException(status_code=400, detail="Permissões insuficientes")
    return ListTransaccionesBanco(
        ListTransacciones=Banco(
            session=session, user=current_user
        ).ObterTransaccionesGeral()
    )


@router.post("/retiros/", status_code=200)
def retiroDeFondos(
    retiro: RetiroFondos,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != retiro.userId:
        raise HTTPException(status_code=400, detail="Permissões insuficientes")

    Banco(session=session, user=current_user).retiroFondos(retiro)

    return Response(status_code=200)


@router.post("/recuperar-senha/", status_code=200)
def recuperarSenha(userEmail=UserEmail, session: Session = Depends(get_session)):
    if not (
        emailDB := session.query(UserModel)
        .filter(UserModel.email == userEmail.email)
        .first()
    ):
        raise HTTPException(
            status_code=400, detail="Usuário não presente no banco de dados"
        )

    if not (Usuario(session=session).recuperaSenha(emailDB)):
        raise HTTPException(status_code=400, detail="Não foi possível enviar o Email")

    return Response(status_code=200)
