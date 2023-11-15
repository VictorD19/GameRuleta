from pydantic import BaseModel


class User(BaseModel):
    username: str
    password: str   
    
class UserPublic(BaseModel):
    id: int
    username: str
    avatar: str
    account: float
    status: bool = True
