from Service.MesaServicio import Mesa
from Schemas.Response import ResponseRequest
from Schemas.Mesas import MesaDetalhesCompletos, HistoricoMesa
from Schemas.SchemaUser import DetalhesApuestaUsuario
from Schemas.Exection import ControllerException
from Models.model import ApuestaModel, JugadaModel, Session, MesaModel
from Service.Porcentagem import Porcentagem
from Service.Ruleta import Ruleta
from sqlalchemy import select, and_
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
                    # self.session.scalars(
                    #     select(MesaModel)
                    #     .join(MesaModel.jugada)
                    #     .where(MesaModel.id == idMesa)
                    #     .where(MesaModel.status == True)
                    # ).one()]
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
            if datetime.now() >= tiempoJugada:
                jugada.fin = datetime.now()
                mesa.status = False
                jugada.ladoGanador = int(
                    Ruleta(jugada=jugada).selecionar_ganador(ruleta=jugada.ruleta)
                )
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
            IndiceGanador=jogadaActivaMesa.ladoGanador
            if (jogadaActivaMesa != None and jogadaActivaMesa.ladoGanador != None)
            else 0,
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
