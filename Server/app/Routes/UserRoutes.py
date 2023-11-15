from fastapi import Depends, HTTPException
from fastapi import APIRouter
from sqlalchemy.orm import Session
from sqlalchemy import select
from Schemas.SchemaUser import UserPublic, User
from Models.model import get_session, UserModel


router = APIRouter()

@router.get("/{user_id}", response_model=UserPublic)
def read_user(user_id: int):
    ...
    return {"user_id": user_id}


@router.post('/create-user/', response_model=UserPublic, status_code=201)
def create_user(user: User, session: Session = Depends(get_session)):

    db_user = session.scalar(
        select(UserModel).where(UserModel.username == user.username)
    )

    if db_user:
        raise HTTPException(
            status_code=400, detail='Username already registered'
        )

    db_user = UserModel(
        username=user.username,
        password=user.password,
        avatar = "Foto",
        account= 0.0,
        status = True)    

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user