from pydantic import BaseModel

class Apuesta(BaseModel):
    IdUsuario: int
    ValorApostado: float
    IdLadoApostado: int