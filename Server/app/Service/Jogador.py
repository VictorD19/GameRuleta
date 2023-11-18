from random import random


class Jogador:
    __MesaService = null
    Jugadores = []

    def __init__(self) -> None:
        __MesaService = Mesa()

    def ObterJugadorPorCodigo(idJugador: int):
        jugador = filter(lambda x: x.Id == idJugador, Jugadores)
        return jugador
