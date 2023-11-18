from Service.MesaServicio import Mesa
from Schemas.Response import ResponseRequest
from Schemas.Mesas import MesaDetalhesCompletos, HistoricoMesa
from Schemas.SchemaUser import DetalhesApuestaUsuario
from Models.model import ApuestaModel, JugadaModel
from Service.Porcentagem import Porcentagem


class SalasGeral:
    def __init__(self, session) -> None:
        self.__session = session
        self.__porcentagemPadrao = 100

    # region Publica
    async def DadosGeraisSalas(self):
        return await Mesa(self.__session).ObterDetallesMesas()

    async def ObterDadosMesaPorId(self, idMesa: int):
        servicoMesa = Mesa(self.__session)
        existeMesa = await servicoMesa.ObterMesaPorId(idMesa)
        jogadaActivaMesa = await servicoMesa.ObterJogadaPorNumeroMesa(idMesa)
        ultimasJogadas = await servicoMesa.ObterUltimasJogadaPorMesa(idMesa)

        apuestas = (
            jogadaActivaMesa.apuestas
            if (jogadaActivaMesa != None and jogadaActivaMesa.apuestas != None)
            else []
        )
        ultimasJogadas = ultimasJogadas if ultimasJogadas != None else []
        valorLadoA = jogadaActivaMesa.ladoA if (jogadaActivaMesa != None) else 0
        valorLadoB = jogadaActivaMesa.ladoB if (jogadaActivaMesa != None) else 0

        retornoMesa = MesaDetalhesCompletos(
            idMesa=existeMesa.id if existeMesa != None else 0,
            jugadoresLadoA=self.ObterDatosJugadoresPorLado(
                list(apuestas),
                idlado=1,
                valorTotalLado=valorLadoA,
            ),
            JugadoresLadoB=self.ObterDatosJugadoresPorLado(
                list(apuestas),
                idlado=2,
                valorTotalLado=valorLadoB,
            ),
            TotalLadoA=float(f"{valorLadoA:.2f}"),
            TotalLadoB=float(f"{valorLadoB :.2f}"),
            TotalApostado=float(f"{valorLadoA +valorLadoB :.2f}"),
            PorcentagemLadoA=Porcentagem(
                valorLadoA + valorLadoB
            ).CalcularPorcentagemAReceberPorValor(valorLadoA),
            HistoricoMesa=self.ObterHitoricoMesa(ultimasJogadas),
        )
        return ResponseRequest().CrearRespuestaSucesso(
            data=retornoMesa, status_code=200, type="WS"
        )

    # endregion
    # region Privada
    def ObterDatosJugadoresPorLado(
        self, apuestas: list[ApuestaModel], idlado: int, valorTotalLado: float
    ) -> list[DetalhesApuestaUsuario]:
        apuestaLadoRequerido = list(filter(lambda a: a.lado == idlado, apuestas))
        jugadoresLado = list(
            set(list(map(lambda a: a.usuarioRelacion, apuestaLadoRequerido)))
        )  # Aqui obtemos los id de los jugadores sin duplicidade para hacer el agrupamento

        retornoJugadas: list[DetalhesApuestaUsuario] = []

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
                    jogada.id, jogada.ladoGanador, jogada.ladoA + jogada.ladoB
                )
            )
        return retornoHistorico

    # endregion
