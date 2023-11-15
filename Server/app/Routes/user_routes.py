from fastapi import APIRouter
from app.Schemas.SchemaUser import UserPublic

router = APIRouter()

@router.get("/{user_id}", response_model=UserPublic)
def read_user(user_id: int):
    ...
    return {"user_id": user_id}

@router.post("/create-user/",
            response_model=UserPublic,
            status_code=201)
def create_user():
    ...
    return {"message": "User created successfully"}