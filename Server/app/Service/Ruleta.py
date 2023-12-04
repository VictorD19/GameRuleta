from Models.model import JugadaModel
from Schemas.Ruleta import DadosParaGenerarRuleta, Lados
from Service.Porcentagem import Porcentagem
from datetime import datetime
import random


class Ruleta:
    def __init__(self, jugada: JugadaModel) -> None:
        self.__jugada = jugada
        self.__ruletaGenerada = []

    def GenerarRuleta(self):
        dadoGerarRuleta = self.__ObterDatosParaGenerarRuleta()
        for numerador in range(1, 101):
            self.__ruletaGenerada.append(
                dadoGerarRuleta.IdLadoMaior
                if dadoGerarRuleta.PorcentagemLadoMaior <= numerador
                else dadoGerarRuleta.IdLadoMenor,
            )
        self.__DesordenarRuleta()
        return self.__ruletaGenerada

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

    def selecionar_ganador(self, ruleta : str):
        time = datetime.now()        
        random.seed(a=time.second, version=2)
        ruleta = ruleta.replace("]","").replace("[","").replace(' ','')
        ruleta = ruleta.split(',')
        index = random.choice([i for i in range(100)])
        ladoGanador = ruleta[index]
        return index, ladoGanador

    
    # endregion
