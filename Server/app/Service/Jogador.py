from random import random


class Jogador:
    __MesaService  = null
    Jugadores = []
    
    def __init__(self) -> None:
        __MesaService = Mesa()
        
    def ObterJogadores():
        Jugadores.append(CriarJogador("Jogador 1"))
        Jugadores.append(CriarJogador("Jogador 2"))
        Jugadores.append(CriarJogador("Jogador 3"))
        Jugadores.append(CriarJogador("Jogador 4"))
        Jugadores.append(CriarJogador("Jogador 5"))
        Jugadores.append(CriarJogador("Jogador 6"))
        
        return Jugadores
    def CriarJogador(nome):
        return {
            "Id": (random() * 100 + 1).toFixed(2),
            "Nome": nome,
            "ValorApostado": 0,
            "Porcentagem": 0,
            "Lado": 0,
        }
    
    def ObterJugadorPorCodigo(idJugador: int):
      jugador =  filter(lambda x: x.Id == idJugador, Jugadores)
      return jugador
