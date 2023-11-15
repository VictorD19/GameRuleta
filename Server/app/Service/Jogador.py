from random import random


class Jogador:
    __MesaService  = null
    
    def __init__(self) -> None:
        __MesaService = Mesa();
    def ObterJogadores():
        return [
            CriarJogador("Jogador 1"),
            CriarJogador("Jogador 2"),
            CriarJogador("Jogador 3"),
            CriarJogador("Jogador 4"),
            CriarJogador("Jogador 5"),
            CriarJogador("Jogador 6"),
        ]

    def CriarJogador(nome):
        return {
            "Id": (random() * 100 + 1).toFixed(2),
            "Nome": nome,
            "ValorApostado": 0,
            "Porcentagem": 0,
            "Lado": 0,
        }
