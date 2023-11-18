from pydantic import BaseModel
from enum import Enum


class DadosParaGenerarRuleta(BaseModel):
    IdLadoMaior: int
    IdLadoMenor: int
    PorcentagemLadoMaior: float
    PorcentagemLadoMenor: float


class ItemRuleta:
    def __init__(self, idLado: int, posicaoInicial: int):
        self.idLado = idLado
        self.PosicaoInicial = posicaoInicial


# class syntax
class Lados(Enum):
    AZUL = 1
    ROJO = 2
