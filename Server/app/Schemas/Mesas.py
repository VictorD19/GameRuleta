from pydantic import BaseModel
from Schemas.SchemaUser import DetalhesApuestaUsuario
from typing import List


class MesaStatus(BaseModel):
    jugadores: int
    minimo: int
    maximo: int
    totalApostado: float
    numero: int


class ListMesas(BaseModel):
    mesas: list[MesaStatus]


class HistoricoMesa(BaseModel):
    idJogada: int
    idLadoGanador: int
    TotalValoApostado: int


class MesaDetalhesCompletos(BaseModel):
    idMesa: int
    status: bool 
    jugadoresLadoA: List[DetalhesApuestaUsuario]
    jugadoresLadoB: List[DetalhesApuestaUsuario]
    totalLadoA: float
    totalLadoB: float
    totalApostado: float
    historicoMesa: List[HistoricoMesa]
    porcentagemLadoA: float
    porcentagemLadoB: float | None = None
