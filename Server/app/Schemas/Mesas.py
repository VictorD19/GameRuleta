import datetime
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
    idLadoGanador: int | int = 0
    TotalValoApostado: float | float = 0.0
    TotalJogadores: int | int = 0


class MesaDetalhesCompletos(BaseModel):
    idMesa: int
    status: bool
    SegundoRestantes: int
    jugadoresLadoA: List[DetalhesApuestaUsuario]
    jugadoresLadoB: List[DetalhesApuestaUsuario]
    totalLadoA: float
    totalLadoB: float
    totalApostado: float
    historicoMesa: List[HistoricoMesa]
    porcentagemLadoA: float
    porcentagemLadoB: float
    ultimoValorTotalJogada: float
    ultimoIndiceGanador: int
    ultimoLadoGanador: int
    ultimaruletaGenerada: str
    RuletaGenerada: str
    ultimaDataRuletaGenerada: str


class EstadisticaJuego(BaseModel):
    jugadoresActivos: int
    totalJugadores: int
    totalPagado: int
    totalJuegosRealizados: int
