from fastapi import Depends, HTTPException, Response
from fastapi import APIRouter
from sqlalchemy.orm import Session
from sqlalchemy import select
from Schemas.SchemaUser import (UserPublic, User, UserUpdate, Token, QrPix)
from Models.model import get_session, UserModel
from Service.securtity import (get_password_hash, verify_password,
                                  create_access_token, get_current_user)
from Controller.UsuarioController import Banco

router = APIRouter()

@router.get("/get/{user_id}", response_model=UserPublic)
def read_user(user_id: int, 
              session: Session = Depends(get_session),              
              current_user: User = Depends(get_current_user)):
    
    if current_user.id != user_id:
        raise HTTPException(status_code=400, detail='Permissões insuficientes')

    db_user = session.scalar(select(UserModel).where(UserModel.id == user_id))

    if db_user is None:
        raise HTTPException(status_code=404, detail='User not found')
    
    return db_user


@router.post('/create-user/', response_model=UserPublic, status_code=201)
def create_user(user: User, session: Session = Depends(get_session)):

    db_user = session.scalar(
        select(UserModel).where(UserModel.username == user.username)
    )

    if db_user:
        raise HTTPException(
            status_code=400, detail='Username already registered'
        )
    
    hashed_password = get_password_hash(user.password)

    db_user = UserModel(
        username=user.username,
        password=hashed_password,
        avatar = "Foto",
        account= 0.0,
        status = True)    

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user


@router.patch('/update/{user_id}', response_model=UserPublic)
def update_user(
    user_id: int,
    user: UserUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)):
    
    if current_user.id != user_id:
        raise HTTPException(status_code=400, detail='Permissões insuficientes')
    
    db_user = session.scalar(select(UserModel).where(UserModel.id == user_id))

    if db_user is None:
        raise HTTPException(status_code=404, detail='User not found')

    if user.username:
        db_user.username = user.username
    
    if user.password:
        db_user.password = get_password_hash(user.password)

    if user.avatar:
        db_user.avatar = user.avatar

    session.commit()
    session.refresh(db_user)
    return db_user


@router.post('/login/', response_model=Token)
def login_for_access_token(
    user: User, 
    session: Session = Depends(get_session)):

    userdb = session.scalar(select(UserModel).where(UserModel.username == user.username))

    if not userdb:
        raise HTTPException(
            status_code=400, detail='Usuario ou senha incorretos'
        )

    if not verify_password(user.password, userdb.password, ):
        raise HTTPException(
            status_code=400, detail='Usuario ou senha incorretos'
        )

    access_token = create_access_token(data={'id': userdb.id})

    return {'access_token': access_token, 'token_type': 'bearer'}


@router.post('/refresh_token/', response_model=Token)
def refresh_access_token(
    user: User = Depends(get_current_user)):

    new_access_token = create_access_token(data={'id': user.id})

    return {'access_token': new_access_token, 'token_type': 'bearer'}


@router.get('/new-cobro-pix/{user_id}/{monto}/', response_model= QrPix)
def newCobroPix(user_id : int, monto: float, current_user: User = Depends(get_current_user)):

    if current_user.id != user_id:
        raise HTTPException(status_code=400, detail='Permissões insuficientes')
    
    getData =  Banco(monto=monto).getQR()
    
    return 

    