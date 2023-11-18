from pydantic import BaseModel


class User(BaseModel):
    id: int | None = None
    username: str
    password: str
    avatar: str | None = None


class UserUpdate(BaseModel):
    username: str | None = None
    password: str | None = None
    avatar: str | None = None


class UserPublic(BaseModel):
    id: int
    username: str
    avatar: str
    account: float
    status: bool = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    userId: int | None = None


class QrPix(BaseModel):
    encodedImage: str | None = None
    payload: str | None = None
    expirationDate: str | None = None
    error: str | None = None


class DetalhesApuestaUsuario:
    def __init__(
        self, nombre: str, imagen: str, porcentagem: float, valorApostado: float
    ):
        self.nombre = nombre
        self.imagen = imagen
        self.porcentagem = porcentagem
        self.valorApostado = valorApostado
