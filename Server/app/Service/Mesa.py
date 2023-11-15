from random import random
import math
from Jogador import Jogador
from Porcentagem import Porcentagem


class Mesa:
    ValorTotalMesa = 0
    ValorTotalLadoA = 0
    ValorTotalLadoB = 0
    PorcentagemLadoA = 0
    PorcentagemLadoB = 0

    Jogadores = []
    PORCENTAGEMPADRAO = 100

    def __init__(self) -> None:
        self.ValorTotalMesa = math.floor(random() * 100 + 1)
        self.__ServicoJogador = Jogador()

    def ObterValorTotalDoLadoApostado(idLad: int):
        return ValorTotalMesa

    def ObterJogadoresDoLado(jogador: any, idLado: int):
        return jogador.Lado == idLado

    def ObterNovoValorTotalDoLadoApostado(valorApostado: float, idLado: int):
        valorLado = map(
            lambda jogador: jogador.ValorApostado + jogador.ValorApostado,
            filter(lambda jogador: ObterJogadoresDoLado(jogador, idLado), Jogadores),
        )

        if idLado == 1:
            ValorTotalLadoA += valorLado
            return ValorTotalLadoA
        else:
            ValorTotalLadoB += valorLado
            return ValorTotalLadoB

    def HacerApuesta(idJogador: int, valorApuesta: float, idLado: int):
        nuevoValorApostado = ObterNovoValorTotalDoLadoApostado(valorApuesta, idLado)
        jugador = self.__ServicoJogador.ObterJugadorPorCodigo(idJogador)
        jugador.ValorApostado += valorApuesta
        jugador.Lado = idLado
        NovoJogadorNaMesa(jugador)
        RecalcularValorPagarJugadoresPorLado(idLado)
        RecalcularValorGeralMesa()

    def NovoJogadorNaMesa(jogador: any):
        self.Jogadores.append(jogador)

    def RecalcularValorPagarJugadoresPorLado(idLado: int):
        valorTotalLado = 0
        if idLado == 1:
            valorTotalLado = self.ValorTotalLadoA
        else:
            valorTotalLado = self.ValorTotalLadoB

        servicosPorcentagem = Porcentagem(valorTotalLado)
        jugadoresDelLado = filter(
            lambda jogador: ObterJogadoresDoLado(jogador, idLado), self.Jugadores
        )
        for jugador in jugadoresDelLado:
            jugador.Porcentagem = (
                servicosPorcentagem.CalcularPorcentagemAReceberPorValor(
                    jugador.ValorApostado
                )
            )

    def RecalcularValorGeralMesa():
        self.ValorTotalMesa = self.ValorTotalLadoA + self.ValorTotalLadoB
        servicosPorcentagem = Porcentagem(self.ValorTotalMesa)
        porcentagemLadoPorId = servicosPorcentagem.CalcularPorcentagemAReceberPorValor(
            self.ValorTotalLadoA
        )
        porcentagemLadoContrario = PORCENTAGEMPADRAO - porcentagemLadoPorId
        self.PorcentagemLadoA = porcentagemLadoPorId
        self.PorcentagemLadoB = porcentagemLadoContrario

    def ObterPorcentagemLadoPorId(idLado: int):
        if idLado == 1:
            return self.PorcentagemLadoA
        else:
            return self.PorcentagemLadoB

    def ObterDadosParaGerarRuleta():
        ladoMaior = self.PorcentagemLadoA > self.PorcentagemLadoB
        porcentagemMaior = self.PorcentagemLadoA if ladoMaior else self.PorcentagemLadoB
        ladoMaiorId = 1 if ladoMaior else 0
        ladoContrario = 0 if (ladoMaiorId == 1) else 1

        return {
            "LadoMaior": ladoMaiorId,
            "PorcentagemMaior": porcentagemMaior,
            "LadoMenor": ladoContrario,
        }
