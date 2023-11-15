from random import random
import math


class Mesa:
    ValorTotalMesa = 0
    ValorTotalLadoA = 0
    ValorTotalLadoB = 0
    Jogadores = []
    
    def __init__(self) -> None:
        self.ValorTotalMesa = math.floor(random() * 100 + 1)

    def ObterValorTotalDoLadoApostado(idLad: int):
        return ValorTotalMesa

    def ObterJogadoresDoLado(jogador:any ,idLado:int):
        return jogador.Lado ==idLado
    
    def ObterNovoValorTotalDoLadoApostado(valorApostado: float,idLado:int):
        valorLado = map(lambda jogador: jogador.ValorApostado + jogador.ValorApostado,filter(lambda jogador: ObterJogadoresDoLado(jogador,idLado),Jogadores))

        if(idLado == 1):
            ValorTotalLadoA += valorLado
            return ValorTotalLadoA
        else:
           ValorTotalLadoB += valorLado
           return ValorTotalLadoB

    def AtualizarValorAposta(novoValor: float):
        ValorTotalMesa = novoValor
        
    def HacerApuesta(idJogador: int, valorApuesta: float, idLado: int):
        nuevoValorApostado = ObterNovoValorTotalDoLadoApostado(valorApuesta,idLado)
