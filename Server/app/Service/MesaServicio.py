from Models.model import JugadaModel, ApuestaModel, MesaModel, UserModel
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, and_
from Schemas.Apuesta import Apuesta
from Service.Porcentagem import Porcentagem
from Schemas.Exection import ServicoException
from datetime import datetime
from Schemas.Ruleta import Lados


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

    async def PagarJugadoresGanador(self, jugada: JugadaModel, ladoGanador: Lados):
        apuestasRelacionada = list(jugada.apuestas)
        apuestasDelLadoGanador = list(
            filter(lambda a: a.lado == ladoGanador, apuestasRelacionada)
        )
        idsUsuariosApostas = list(
            set(list(map(lambda a: a.usuario, apuestasDelLadoGanador)))
        )  # selecionamos los id de los usuarios que devemos pagar. para agrupar e pagarConforme aposta
        totalValorJugada = jugada.ladoA + jugada.ladoB
        totalLadoGanador = jugada.ladoA if ladoGanador == Lados.AZUL else jugada.ladoB
        valorTotalPagado = totalValorJugada
        for index in range(1, len(idsUsuariosApostas)):
            idUsuario = idsUsuariosApostas[index]
            apuestasPorUsuario = list(
                filter(lambda a: a.usuario == idUsuario), apuestasDelLadoGanador
            )
            jugador: UserModel = apuestasPorUsuario[0].usuarioRelacion

            if index == (len(idsUsuariosApostas) - 1):
                jugador.account += valorTotalPagado
                break

            totalValorApostadoJugador = sum(
                list(map(lambda a: a.monto, apuestasPorUsuario))
            )

            porcentagemAReceber = Porcentagem(
                totalLadoGanador
            ).CalcularPorcentagemAReceberPorValor(totalValorApostadoJugador)
            valorAReceber = Porcentagem(
                totalValorJugada
            ).CalcularValorPagarPorPorcentagem(porcentagemAReceber)

            for apuestaUser in apuestasPorUsuario:
                porcentagemApuesta = Porcentagem(
                    totalLadoGanador
                ).CalcularPorcentagemAReceberPorValor(apuestaUser.monto)
                apuestaUser.montoResultado = Porcentagem(
                    totalLadoGanador
                ).CalcularValorPagarPorPorcentagem(porcentagemApuesta)
                apuestaUser.resultado = True

            jugador.account += valorAReceber
            valorTotalPagado -= valorAReceber
            self.__session.commit()


# endregion
