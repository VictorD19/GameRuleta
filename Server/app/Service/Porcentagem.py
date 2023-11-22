class Porcentagem:
    def __init__(self, valorTotal: float) -> None:
        self.__valorTotal = valorTotal

    def CalcularValorPagarPorPorcentagem(self, porcentagem: float):
        resultadoMultiplicacao = porcentagem * self.__valorTotal
        valorPagar = resultadoMultiplicacao / 100
        return float(f"{valorPagar:.2f}")

    def CalcularPorcentagemAReceberPorValor(self, valorInserido: float):
        if self.__valorTotal == 0:
            return 50

        porcentagem = (valorInserido * 100) / self.__valorTotal
        return float(f"{porcentagem:.2f}")
