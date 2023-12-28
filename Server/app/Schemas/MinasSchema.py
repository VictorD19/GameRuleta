from pydantic import BaseModel


class MinasApuesta(BaseModel):
    cant_minas: int
    monto: float


class JugadaMinas(BaseModel):
    posicion : set
