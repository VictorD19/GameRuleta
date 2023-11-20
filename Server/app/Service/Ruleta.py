from Models.model import JugadaModel
from Schemas.Ruleta import DadosParaGenerarRuleta, Lados, ItemRuleta
from Service.Porcentagem import Porcentagem
import random
import math


class Ruleta:
    def __init__(self, jugada: JugadaModel) -> None:
        self.__jugada = jugada
        self.__ruletaGenerada: list[ItemRuleta] = []

    def GenerarRuleta(self):
        dadoGerarRuleta = self.__ObterDatosParaGenerarRuleta()
        for numerador in range(1, 101):
            self.__ruletaGenerada.append(
                ItemRuleta(
                    idLado=dadoGerarRuleta.IdLadoMaior
                    if dadoGerarRuleta.PorcentagemLadoMaior <= numerador
                    else dadoGerarRuleta.IdLadoMenor,
                    posicaoInicial=numerador,
                )
            )

        self.__DesordenarRuleta()
        self.__SelecionarAlGanador()

    # region Metodos auxiliare
    def __ObterDatosParaGenerarRuleta(self) -> DadosParaGenerarRuleta:
        valorTotal = self.__jugada.ladoA + self.__jugada.ladoB
        idLadoMaior: Lados = (
            Lados.AZUL if self.__jugada.ladoA > self.__jugada.ladoB else Lados.ROJO
        )
        idLadoMenor = Lados.ROJO if idLadoMaior == Lados.AZUL else Lados.AZUL
        porcentagemMaior = Porcentagem(valorTotal).CalcularPorcentagemAReceberPorValor(
            self.__jugada.ladoA if idLadoMaior == Lados.AZUL else self.__jugada.ladoB
        )
        porcentagemMenor = 100 - porcentagemMaior  # 100 es la porcentagem padron
        return DadosParaGenerarRuleta(
            IdLadoMaior=idLadoMaior,
            IdLadoMenor=idLadoMenor,
            PorcentagemLadoMaior=porcentagemMaior,
            PorcentagemLadoMenor=porcentagemMenor,
        )

    def __DesordenarRuleta(self):
        for i in range(len(self.__ruletaGenerada) - 1, 0, -1):
            j = random.randint(0, i)
            self.__ruletaGenerada[i], self.__ruletaGenerada[j] = (
                self.__ruletaGenerada[j],
                self.__ruletaGenerada[i],
            )

    def __SelecionarAlGanador(self):
        min = 0
        max = 0

        if self.__jugada.ladoA > self.__jugada.ladoB:
            max = self.__jugada.ladoA
            min = self.__jugada.ladoB
        else:
            max = self.__jugada.ladoB
            min = self.__jugada.ladoA
        numeroAleatorio = math.floor(random() * (max - min) + min)
        ganador = self.__ruletaGenerada[numeroAleatorio]
        ganador.PosicaoInicial = numeroAleatorio
        self.Ganador = ganador

    def ObterGanador(self):
        return self.Ganador

    # endregion
