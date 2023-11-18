from Models.model import JugadaModel, ApuestaModel, MesaModel
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, and_
from Schemas.Apuesta import Apuesta
from Service.Porcentagem import Porcentagem
from Schemas.Exection import ServicoException
from datetime import datetime


class Mesa:
    def __init__(self, session: Session) -> None:
        self.__session = session

    # region Metodos Auxiliares
    def ObterNovoValorTotalDoLadoApostado(
        self, valorApostado: float, jugada: JugadaModel, idLado: int
    ):
        if idLado == 1:
            jugada.ladoA += valorApostado
        else:
            jugada.ladoB += valorApostado

    def obtenerTotalJugadores(self, jugadas: list[JugadaModel]) -> int:
        if len(jugadas) == 0:
            return 0

        jugadasActivas = list(filter(lambda j: j.fin == None, jugadas))
        apuestasJugadores = list(map(lambda a: a.usuario, jugadasActivas[0].apuestas))

        return len(list(set(apuestasJugadores)))

    def obterTotalApostado(self, jugadas: list) -> float:
        if len(jugadas) == 0:
            return 0
        jugadasActivas = list(filter(lambda j: j.fin == None, jugadas))
        valoresJugada = []

        for jugada in jugadasActivas:
            if jugada.ladoA != None:
                valoresJugada.append(jugada.ladoA)
            if jugada.ladoB != None:
                valoresJugada.append(jugada.ladoB)

        return sum(valoresJugada)

    # endregion
    # region Metodos Principales
    async def ObterJogadaPorNumeroMesa(self, idNumeroMesa: int):
        jogadaAtivaMesa = self.__session.scalars(
            select(JugadaModel).where(
                and_(JugadaModel.mesa == idNumeroMesa, JugadaModel.fin == None)
            )
        ).first()
        return jogadaAtivaMesa

    async def ObterUltimasJogadaPorMesa(self, idMesa: int):
        jogadaAtivaMesa = (
            self.__session.query(JugadaModel)
            .filter(and_(JugadaModel.mesa == idMesa, JugadaModel.fin != None))
            .limit(15)
            .all()
        )
        return list(jogadaAtivaMesa)

    async def CriarNovaJogada(self, apuesta: Apuesta):
        novaJogada = JugadaModel(mesa=apuesta.IdMesa, creacion=datetime.now())

        if apuesta.IdLadoApostado == 1:
            novaJogada.ladoA = apuesta.ValorApostado
            novaJogada.ladoB = 0
        else:
            novaJogada.ladoB = apuesta.ValorApostado
            novaJogada.ladoA = 0

        self.__session.add(novaJogada)
        self.__session.commit()
        return novaJogada

    async def CriarApuestaJugador(self, apuesta: Apuesta, jugada: JugadaModel):
        valorTotalLado = jugada.ladoA if (apuesta.IdLadoApostado == 1) else jugada.ladoB

        if valorTotalLado == None or valorTotalLado == 0:
            valorTotalLado = apuesta.ValorApostado

        porcentagemJugada = Porcentagem(
            valorTotalLado
        ).CalcularPorcentagemAReceberPorValor(apuesta.ValorApostado)
        nuevaApuesta = ApuestaModel(
            usuario=apuesta.IdUsuario,
            monto=apuesta.ValorApostado,
            lado=apuesta.IdLadoApostado,
            jugada=jugada.id,
            porcentaje=porcentagemJugada,
            fecha=datetime.now(),
        )
        self.__session.add(nuevaApuesta)
        return nuevaApuesta

    async def ObterDetallesMesas(self):
        mesas = (
            self.__session.query(MesaModel)
            .options(joinedload(MesaModel.jugada).joinedload(JugadaModel.apuestas))
            .all()
        )

        return [
            {
                "jugadores": self.obtenerTotalJugadores(mesa.jugada),
                "maximo": mesa.maximo if mesa.maximo else 0,
                "minimo": mesa.minimo if mesa.minimo else 0,
                "totalApostado": self.obterTotalApostado(mesa.jugada),
                "numero": mesa.numero,
            }
            for mesa in mesas
        ]

    async def ObterMesaPorId(self, idMesa: int):
        existeMesa = self.__session.scalars(
            select(MesaModel).where(MesaModel.id == idMesa)
        ).first()

        if existeMesa == None:
            raise ServicoException("Registro da mesa não encontrado")

        return existeMesa

    async def PagarJugadoresGanador(self, jugada: JugadaModel):
        pass


# endregion
