from pydantic import BaseModel
from datetime import datetime
from typing import List


class User(BaseModel):
    id: int | None = None
    username: str
    password: str
    avatar: str | None = None
    codReferencia: str | None = None
    email: str | None = None
    usuarioAdministrador: bool  = False


class UserSaldo(BaseModel):
    id: int | None = None
    account: float
    ganancias: float


class UserUpdate(BaseModel):
    username: str | None = None
    password: str | None = None
    avatar: str | None = None


class UserPublic(BaseModel):
    id: int
    username: str | None = None
    avatar: str | None = None
    saldo: float | None = None
    status: bool = True
    dataCriacion: datetime | None = None
    ganancias: float | None = None
    usuarioAministador: bool | None = None


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    userId: int | None = None


class QrPix(BaseModel):
    idQr: str | None = None
    encodedImage: str | None = None
    payload: str | None = None
    expirationDate: str | None = None
    error: str | None = None


class StatusPix(BaseModel):
    idQr: str | None = None
    status: bool | None = None
    error: str | None = None


class DetalhesApuestaUsuario(BaseModel):
    nombre: str
    imagen: str
    porcentagem: float
    valorApostado: float


class TransaccionesBanco(BaseModel):
    idExterno: str | None = None
    id: int
    tipo: str
    monto: float
    fechaCreado: datetime
    fechaPagado: datetime | None = None
    status: bool


class ListTransaccionesBanco(BaseModel):
    ListTransacciones: List[TransaccionesBanco]


class RetiroFondos(BaseModel):
    userId: int
    monto: float
    chavePix: str
    llaveTipo: str


class UserEmail(BaseModel):
    email: str
