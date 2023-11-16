from Service.MesaServicio import *

class SalasGeral:

    def __init__(self, session) -> None:
        self.__session = session

    async def DadosGeraisSalas(self):

        return await Mesa(self.__session).ObterDetallesMesas()
        
    