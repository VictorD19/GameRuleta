

class Porcentagem:
    def __init__(self,valorTotal:int) -> None:
       self.ValorTotal = valorTotal

    def CalcularValorPagarPorPorcentagem(porcentagem:float):
        resultadoMultiplicacao = porcentagem * self.ValorTotal
        valorPagar = resultadoMultiplicacao / 100
        return valorPagar.toFixed(2)
    
    def CalcularPorcentagemAReceberPorValor(valorInserido:float):
        porcentagem = ((valorInserido * 100) / self.ValorTotal)
        return porcentagem.toFixed(2)