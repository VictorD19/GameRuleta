from Service.MesaServicio import Mesa
from Schemas.Response import ResponseRequest
from Schemas.Mesas import MesaDetalhesCompletos, HistoricoMesa
from Schemas.SchemaUser import DetalhesApuestaUsuario
from Schemas.Exection import ControllerException
from Models.model import ApuestaModel, JugadaModel, Session, MesaModel
from Service.Porcentagem import Porcentagem
from Service.datetime_now import datetime_local_actual
from Service.Ruleta import Ruleta
from sqlalchemy import select, and_, desc
from sqlalchemy.orm import joinedload
from datetime import datetime, timedelta
from dotenv import load_dotenv
from fastapi import HTTPException
import os
import math
import json

load_dotenv()


class SalasGeral:
    def __init__(self, session: Session) -> None:
        self.session = session

    # region Publica
    async def DadosGeraisSalas(self):
        return await Mesa(self.session).ObterDetallesMesas()

    async def CheckStatusMesa(self, idMesa: int):
        try:
            if not (
                mesa := (
                    self.session.query(MesaModel)
                    .filter(and_(MesaModel.id == idMesa, MesaModel.status == True))
                    .options(joinedload(MesaModel.jugada))
                    .first()
                )
            ):
                return

            if not (jugada := list(filter(lambda jug: jug.fin == None, mesa.jugada))):
                return

            jugada = jugada[0]

            if not jugada.inicio:
                return

            tiempoJugada = jugada.inicio + timedelta(seconds=30)
            if datetime_local_actual() >= tiempoJugada:
                jugada.fin = datetime_local_actual()
                mesa.status = False
                index, ladoGanador = Ruleta(jugada=jugada).selecionar_ganador(
                    ruleta=jugada.ruleta
                )
                jugada.ladoGanador = int(ladoGanador)
                jugada.IndiceGanador = index

                if not (
                    Mesa(session=self.session).PagarJugadoresGanador(jugada=jugada)
                ):
                    raise ControllerException("Error no pagamento.")

                self.session.commit()
            return

        except ControllerException as ex:
            self.session.rollback()
            raise HTTPException(status_code=400, detail=str(ex))

        except Exception as ex:
            self.session.rollback()
            raise HTTPException(status_code=400, detail=str(ex))

    def ObterUltimoIndexLadoGanador(self):
        try:
            if not (
                jugada := self.session.query(JugadaModel)
                .filter(JugadaModel.fin.is_not(None))
                .order_by(desc(JugadaModel.id))
                .first()
            ):
                return 0, 0
            IndiceGanador = jugada.IndiceGanador if jugada.IndiceGanador else 0
            ladoGanador = jugada.ladoGanador if jugada.ladoGanador else 0
            ultimaruletaGenerada = jugada.ruleta
            dataFin = jugada.fin.strftime("%m/%d/%Y, %H:%M:%S")
            return IndiceGanador, ladoGanador, ultimaruletaGenerada, dataFin
        except Exception as ex:
            return 0, 0

    async def ObterDadosMesaPorId(self, idMesa: int):
        servicoMesa = Mesa(self.session)
        existeMesa = await servicoMesa.ObterMesaPorId(idMesa)
        jogadaActivaMesa = await servicoMesa.ObterJogadaPorNumeroMesa(idMesa)
        ultimasJogadas = await servicoMesa.ObterUltimasJogadaPorMesa(idMesa)

        apuestas = (
            jogadaActivaMesa.apuestas
            if (jogadaActivaMesa and jogadaActivaMesa.apuestas)
            else []
        )

        ultimasJogadas = ultimasJogadas if ultimasJogadas else []
        valorLadoA = jogadaActivaMesa.ladoA if jogadaActivaMesa else 0
        valorLadoB = jogadaActivaMesa.ladoB if jogadaActivaMesa else 0

        jugadoresLadoA = self.ObterDatosJugadoresPorLado(
            list(apuestas),
            idlado=1,
            valorTotalLado=valorLadoA,
        )

        jugadoresLadoB = self.ObterDatosJugadoresPorLado(
            list(apuestas),
            idlado=2,
            valorTotalLado=valorLadoB,
        )

        (
            ultimoIndiceGanador,
            ultimoLadoGanador,
            ultimaruletaGenerada,
            dataFin,
        ) = self.ObterUltimoIndexLadoGanador()

        detallesMesa = MesaDetalhesCompletos(
            idMesa=existeMesa.id if existeMesa else 0,
            status=existeMesa.status,
            jugadoresLadoA=jugadoresLadoA,
            jugadoresLadoB=jugadoresLadoB,
            totalLadoA=float(f"{valorLadoA:.2f}"),
            totalLadoB=float(f"{valorLadoB :.2f}"),
            totalApostado=float(f"{valorLadoA + valorLadoB :.2f}"),
            porcentagemLadoA=Porcentagem(
                valorLadoA + valorLadoB
            ).CalcularPorcentagemAReceberPorValor(valorLadoA),
            historicoMesa=self.ObterHitoricoMesa(ultimasJogadas),
            porcentagemLadoB=Porcentagem(
                valorLadoA + valorLadoB
            ).CalcularPorcentagemAReceberPorValor(valorLadoB),
            ultimoIndiceGanador=int(ultimoIndiceGanador),
            ultimoLadoGanador=int(ultimoLadoGanador),
            ultimaruletaGenerada=ultimaruletaGenerada,
            ultimaDataRuletaGenerada=dataFin,
            SegundoRestantes=servicoMesa.segundos_restantes(jogadaActivaMesa),
            RuletaGenerada=jogadaActivaMesa.ruleta
            if jogadaActivaMesa != None and jogadaActivaMesa.ruleta != None
            else "[]",
        )
        return detallesMesa

    # endregion
    # region Privada
    def ObterDatosJugadoresPorLado(
        self, apuestas: list, idlado: int, valorTotalLado: float
    ):
        apuestaLadoRequerido = list(filter(lambda a: a.lado == idlado, apuestas))
        jugadoresLado = list(
            set(list(map(lambda a: a.usuarioRelacion, apuestaLadoRequerido)))
        )  # Aqui obtemos los id de los jugadores sin duplicidade para hacer el agrupamento

        retornoJugadas = []

        for usuario in jugadoresLado:
            apuestasDelJugador = list(
                filter(lambda a: a.usuario == usuario.id, apuestaLadoRequerido)
            )  # Aqui obtemos todas las apuestas del jugador
            totalValorApostadoJugador = sum(
                list(map(lambda a: a.monto, apuestasDelJugador))
            )  # Aqui obtemos el total del valor apostado por lado del jugador
            detalhesJugador = DetalhesApuestaUsuario(
                nombre=usuario.username,
                imagen=usuario.avatar,
                porcentagem=Porcentagem(
                    valorTotalLado
                ).CalcularPorcentagemAReceberPorValor(totalValorApostadoJugador),
                valorApostado=float(f"{totalValorApostadoJugador:.2f}"),
            )
            retornoJugadas.append(detalhesJugador)

        return retornoJugadas

    def ObterHitoricoMesa(self, jogadasMesa: list[JugadaModel]):
        retornoHistorico: list[HistoricoMesa] = []

        for jogada in jogadasMesa:
            retornoHistorico.append(
                HistoricoMesa(
                    idJogada=jogada.id,
                    idLadoGanador=jogada.ladoGanador
                    if jogada.ladoGanador != None
                    else 0,
                    TotalValoApostado=(jogada.ladoA + jogada.ladoB),
                    TotalJogadores=self.ObterJugadoresNaoDuplicadosPorApuestas(
                        jogada.apuestas
                    ),
                )
            )
        return retornoHistorico

    def ObterJugadoresNaoDuplicadosPorApuestas(self, apuestas: list[ApuestaModel]):
        jugadores = list(map(lambda a: a.usuario, apuestas))
        if len(jugadores) == 0:
            return 0

        return len(list(set(jugadores)))

    # endregion
