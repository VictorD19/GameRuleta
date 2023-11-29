from Service.MesaServicio import Mesa
from Schemas.Response import ResponseRequest
from Schemas.Mesas import MesaDetalhesCompletos, HistoricoMesa
from Schemas.SchemaUser import DetalhesApuestaUsuario
from Models.model import ApuestaModel, JugadaModel, Session, MesaModel
from Service.Porcentagem import Porcentagem
from Service.Ruleta import Ruleta
from sqlalchemy import and_
from sqlalchemy.orm import joinedload
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
import math

load_dotenv()


class SalasGeral:
    def __init__(self, session: Session) -> None:
        self.__session = session
        self.__porcentagemPadrao = 100

    # region Publica
    async def DadosGeraisSalas(self):
        return await Mesa(self.__session).ObterDetallesMesas()

    async def CheckStatusMesa(self, idMesa: int):
        try:
            if not (
                mesa := (
                    self.__session.query(MesaModel)
                    .options(joinedload(MesaModel.jugada))
                    .filter(and_(MesaModel.status == True, MesaModel.id == idMesa))
                    .first()
                )
            ):
                return

            if not (jugada := list(filter(lambda jug: jug.fin == None, mesa.jugada))):
                return

            jugada = jugada[0]

            if not jugada.inicio:
                return
            #     jugada.inicio = datetime.now()
            #     self.__session.commit()
            #     self.__session.refresh(jugada)

            tiempoJugada = jugada.inicio + timedelta(
                seconds=int(os.getenv("TIME_RULETA"))
            )
            if datetime.now() >= tiempoJugada:
                jugada.fin = datetime.now()
                mesa.status = False
                jugada.ladoGanador = int(Ruleta(jugada=jugada).selecionar_ganador(ruleta=jugada.ruleta)) 
                self.__session.commit()
            return
        except Exception as ex:
            self.__session.rollback()
            print(f"error CheckStatusMesa -> {ex}")

    async def ObterDadosMesaPorId(self, idMesa: int):
        # Instanciamos la clase mesa
        servicoMesa = Mesa(self.__session)
        # Obetenemos los distintos valores de la mesa
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
            IndiceGanador=0,
            SegundoRestantes=math.floor(
                (jogadaActivaMesa.inicio - datetime.now()).total_seconds()
            )
            if (jogadaActivaMesa != None and jogadaActivaMesa.inicio != None)
            else 0,
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
