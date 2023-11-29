from Models.model import JugadaModel, ApuestaModel, MesaModel, UserModel
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, and_
from Schemas.Apuesta import Apuesta
from Service.Porcentagem import Porcentagem
from Schemas.Exection import ServicoException
from datetime import datetime
from Schemas.Ruleta import Lados
from fastapi import HTTPException


class Mesa:
    def __init__(self, session: Session) -> None:
        self.session = session

    # region Metodos Auxiliares
    def ObterNovoValorTotalDoLadoApostado(
        self, apuesta: Apuesta, jugada: JugadaModel):

        if apuesta.IdLadoApostado == 1:
            jugada.ladoA += apuesta.ValorApostado
        else:
            jugada.ladoB += apuesta.ValorApostado

    def obtenerTotalJugadores(self, jugadas: list[JugadaModel]) -> int:
        if len(jugadas) == 0:
            return 0

        jugadasActivas = list(filter(lambda j: j.fin == None, jugadas))

        if len(jugadasActivas) == 0:
            return 0

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
        return (
            self.session.query(JugadaModel)
            .filter(and_(JugadaModel.mesa == idNumeroMesa, JugadaModel.fin == None))
            .first()
        )

    def ObterJogadaActivaPorMesa(self, idMesa: int):
        return (
            self.session.query(JugadaModel)
            .filter(and_(JugadaModel.mesa == idMesa, JugadaModel.fin == None))
            .first()
        )

    async def ObterUltimasJogadaPorMesa(self, idMesa: int):
        return (
            self.session.query(JugadaModel)
            .filter(and_(JugadaModel.mesa == idMesa, JugadaModel.fin != None))
            .limit(15)
            .all()
        )

    def CriarNovaJogada(self, apuesta: Apuesta):
        try:
            novaJogada = JugadaModel(mesa=apuesta.IdMesa, creacion=datetime.now())

            if apuesta.IdLadoApostado == 1:
                novaJogada.ladoA = apuesta.ValorApostado
                novaJogada.ladoB = 0
            else:
                novaJogada.ladoB = apuesta.ValorApostado
                novaJogada.ladoA = 0

            self.session.add(novaJogada)
            self.session.commit()
            self.session.refresh(novaJogada)
            return novaJogada

        except Exception as ex:
            self.session.rollback()
            raise HTTPException(
                status_code=400, detail="Error al intentar crear nueva jugada"
            )

    def CriarApuestaJugador(self, apuesta: Apuesta, jugada: JugadaModel):
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
        self.session.add(nuevaApuesta)
        return nuevaApuesta

    async def ObterDetallesMesas(self):
        mesas = (
            self.session.query(MesaModel)
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
        existeMesa = (
            self.session.query(MesaModel).filter(MesaModel.id == idMesa).first()
        )
        if not existeMesa:
            raise ServicoException("Registro da mesa não encontrado")
        return existeMesa

    # async def PagarJugadoresGanador(self, jugada: JugadaModel, ladoGanador: Lados):
    #     apuestasRelacionada = list(jugada.apuestas)
    #     apuestasDelLadoGanador = list(
    #         filter(lambda a: a.lado == ladoGanador, apuestasRelacionada)
    #     )
    #     idsUsuariosApostas = list(
    #         set(list(map(lambda a: a.usuario, apuestasDelLadoGanador)))
    #     )  # selecionamos los id de los usuarios que devemos pagar. para agrupar e pagarConforme aposta
    #     totalValorJugada = jugada.ladoA + jugada.ladoB
    #     totalLadoGanador = jugada.ladoA if ladoGanador == Lados.AZUL else jugada.ladoB
    #     valorTotalPagado = totalValorJugada
    #     for index in range(1, len(idsUsuariosApostas)):
    #         idUsuario = idsUsuariosApostas[index]
    #         apuestasPorUsuario = list(
    #             filter(lambda a: a.usuario == idUsuario), apuestasDelLadoGanador
    #         )
    #         jugador: UserModel = apuestasPorUsuario[0].usuarioRelacion

    #         if index == (len(idsUsuariosApostas) - 1):
    #             jugador.account += valorTotalPagado
    #             break

    #         totalValorApostadoJugador = sum(
    #             list(map(lambda a: a.monto, apuestasPorUsuario))
    #         )

    #         porcentagemAReceber = Porcentagem(
    #             totalLadoGanador
    #         ).CalcularPorcentagemAReceberPorValor(totalValorApostadoJugador)
    #         valorAReceber = Porcentagem(
    #             totalValorJugada
    #         ).CalcularValorPagarPorPorcentagem(porcentagemAReceber)

    #         for apuestaUser in apuestasPorUsuario:
    #             porcentagemApuesta = Porcentagem(
    #                 totalLadoGanador
    #             ).CalcularPorcentagemAReceberPorValor(apuestaUser.monto)
    #             apuestaUser.montoResultado = Porcentagem(
    #                 totalLadoGanador
    #             ).CalcularValorPagarPorPorcentagem(porcentagemApuesta)
    #             apuestaUser.resultado = True

    #         jugador.account += valorAReceber
    #         valorTotalPagado -= valorAReceber
    #         self.session.commit()

    def validadLadosConApuesta(self, jugada: JugadaModel, apuesta: Apuesta):
        if jugada.ladoA > 0 and apuesta.IdLadoApostado == 2:
            return True

        if jugada.ladoB > 0 and apuesta.IdLadoApostado == 1:
            return True

        return False


# endregion
