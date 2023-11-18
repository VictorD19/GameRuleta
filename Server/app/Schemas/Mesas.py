from pydantic import BaseModel
from Schemas.SchemaUser import DetalhesApuestaUsuario


class MesaStatus(BaseModel):
    jugadores: int
    minimo: int
    maximo: int
    totalApostado: float
    numero: int


class ListMesas(BaseModel):
    mesas: list[MesaStatus]


class HistoricoMesa:
    def __init__(self, idjogada: int, idLadoGanador: int, TotalValoApostado: int):
        self.idJogada = idjogada
        self.idLadoGanador = idLadoGanador
        self.TotalValoApostado = TotalValoApostado


class MesaDetalhesCompletos:
    def __init__(
        self,
        idMesa: id,
        jugadoresLadoA: list[DetalhesApuestaUsuario],
        JugadoresLadoB: list[DetalhesApuestaUsuario],
        TotalLadoA: float,
        TotalLadoB: float,
        TotalApostado: float,
        HistoricoMesa: list[HistoricoMesa],
        PorcentagemLadoA: float,
    ):
        self.idMesa = idMesa
        self.jugadoresLadoA = jugadoresLadoA
        self.JugadoresLadoB = JugadoresLadoB
        self.TotalLadoA = TotalLadoA
        self.TotalLadoB = TotalLadoB
        self.TotalApostado = TotalApostado
        self.HistoricoMesa = HistoricoMesa
        self.PorcentagemLadoA = PorcentagemLadoA
        self.PorcentagemLadoB = 100 - PorcentagemLadoA
