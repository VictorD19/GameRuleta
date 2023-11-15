from Mesa import Mesa
import math
from random import random,randint


class Ruleta:
    def __init__(self) -> None:
        self.RULETA = []

    def GenerarRuleta():
        servicoMesa = Mesa()
        dadosGerarRuleta = servicoMesa.ObterDadosParaGerarRuleta()
        for itemRuleta in range(1, 100):
            if itemRuleta <= dadosGerarRuleta.LadoMaior:
                self.RULETA.append(
                    {"Id": itemRuleta, "Lado": dadosGerarRuleta.LadoMaior}
                )
            else:
                self.RULETA.append(
                    {"Id": itemRuleta, "Lado": dadosGerarRuleta.LadoMenor}
                )
        DesordenarRuleta()

    def DesordenarRuleta():
        for i in range(len(self.RULETA) - 1, 0, -1):
            j = random.randint(0, i)
            self.RULETA[i], self.RULETA[j] = self.RULETA[j], self.RULETA[i]

    def SelecionarAoGanador():
        servicoMesa = Mesa()
        valores = ValoresGerarNumeroAletorio(servicoMesa.ObterPorcentagemLadoPorId(1),servicoMesa.ObterPorcentagemLadoPorId(2))
        Ganador = self.RULETA[math.floor(random() * (valores["MIN"] -valores["MAX"]) + valores["MIN"])]
        return Ganador

    def ValoresGerarNumeroAletorio(valorA: float, valorb: float):
        if valorA > valorb:
            return {
                MIN: valorb,
                MAX: valorA,
            }
        else:
            return {
                MIN: valorA,
                MAX: valorb,
            }
