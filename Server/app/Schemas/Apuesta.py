from pydantic import BaseModel
from datetime import datetime
from typing  import List


class Apuesta(BaseModel):
    IdUsuario: int
    ValorApostado: float
    IdLadoApostado: int
    IdMesa: int

class UltimaApuesta(BaseModel):
    monto: float | None = None
    montoResultado: float| None = None
    porcentaje: float| None = None
    lado: int| None = None
    fecha: str| None = None
    resultado: bool| None = None

class UltimasApuestas(BaseModel): 
    Apuestas: List[UltimaApuesta]

