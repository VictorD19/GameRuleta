import json
from random import randint
import asyncio

class SalasGeral:
    def __init__(self) -> None:
       pass

    async def DadosGeraisSalas(self):
        return json.dumps(
            {
                "Sala1": {
                    "Min": 1,
                    "Max": 200,
                    "Jugadores": 0,
                    "ValorRodada": randint(1, 100),
                },
                "Sala2": {
                    "Min": 10,
                    "Max": 1000,
                    "Jugadores": 0,
                    "ValorRodada": randint(1, 100),
                },
                "Sala3": {
                    "Min": 1000,
                    "Max": 10000,
                    "Jugadores": 0,
                    "ValorRodada": randint(1, 100),
                }
            }
        )
