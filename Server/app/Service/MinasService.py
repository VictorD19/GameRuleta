import random


class MinasService:
    def __init__(self) -> None:
        ...

    def generar_matriz(self, minas):
        matriz = [[1] * 5 for _ in range(5)]
        for _ in range(minas):
            fila = random.randint(0, 4)
            columna = random.randint(0, 4)

            while matriz[fila][columna] == 0:
                fila = random.randint(0, 4)
                columna = random.randint(0, 4)

            matriz[fila][columna] = 0

        return str(matriz)
