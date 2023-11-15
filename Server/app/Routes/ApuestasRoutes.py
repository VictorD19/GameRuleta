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