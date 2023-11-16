from Models.model import JugadaModel, ApuestaModel, MesaModel
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select,and_
from Schemas.Mesas import MesaStatus, ListMesas
from Schemas.Apuesta import Apuesta
from Service.Porcentagem import Porcentagem
from datetime import datetime
"""
    ValorTotalMesa = 0
    ValorTotalLadoA = 0
    ValorTotalLadoB = 0
    PorcentagemLadoA = 0
    PorcentagemLadoB = 0

    Jogadores = []
    PORCENTAGEMPADRAO = 100
"""




class Mesa:    

    def __init__(self, session: Session ) -> None:
        # self.ValorTotalMesa = math.floor(random() * 100 + 1)
        # self.__ServicoJogador = Jogador()
        # self.__mesas = [1,2,3]
        self.__session = session

    # def ObterValorTotalDoLadoApostado(idLad: int):
    #     return ValorTotalMesa

    # def ObterJogadoresDoLado(jogador: any, idLado: int):
    #     return jogador.Lado == idLado

    # def ObterNovoValorTotalDoLadoApostado(valorApostado: float, idLado: int):
    #     valorLado = map(
    #         lambda jogador: jogador.ValorApostado + jogador.ValorApostado,
    #         filter(lambda jogador: ObterJogadoresDoLado(jogador, idLado), Jogadores),
    #     )

    #     if idLado == 1:
    #         ValorTotalLadoA += valorLado
    #         return ValorTotalLadoA
    #     else:
    #         ValorTotalLadoB += valorLado
    #         return ValorTotalLadoB

    # def HacerApuesta(idJogador: int, valorApuesta: float, idLado: int):
    #     nuevoValorApostado = ObterNovoValorTotalDoLadoApostado(valorApuesta, idLado)
    #     jugador = self.__ServicoJogador.ObterJugadorPorCodigo(idJogador)
    #     jugador.ValorApostado += valorApuesta
    #     jugador.Lado = idLado
    #     NovoJogadorNaMesa(jugador)
    #     RecalcularValorPagarJugadoresPorLado(idLado)
    #     RecalcularValorGeralMesa()

    # def NovoJogadorNaMesa(jogador: any):
    #     self.Jogadores.append(jogador)

    # def RecalcularValorPagarJugadoresPorLado(idLado: int):
    #     valorTotalLado = 0
    #     if idLado == 1:
    #         valorTotalLado = self.ValorTotalLadoA
    #     else:
    #         valorTotalLado = self.ValorTotalLadoB

    #     servicosPorcentagem = Porcentagem(valorTotalLado)
    #     jugadoresDelLado = filter(
    #         lambda jogador: ObterJogadoresDoLado(jogador, idLado), self.Jugadores
    #     )
    #     for jugador in jugadoresDelLado:
    #         jugador.Porcentagem = (
    #             servicosPorcentagem.CalcularPorcentagemAReceberPorValor(
    #                 jugador.ValorApostado
    #             )
    #         )

    # def RecalcularValorGeralMesa():
    #     self.ValorTotalMesa = self.ValorTotalLadoA + self.ValorTotalLadoB
    #     servicosPorcentagem = Porcentagem(self.ValorTotalMesa)
    #     porcentagemLadoPorId = servicosPorcentagem.CalcularPorcentagemAReceberPorValor(
    #         self.ValorTotalLadoA
    #     )
    #     porcentagemLadoContrario = PORCENTAGEMPADRAO - porcentagemLadoPorId
    #     self.PorcentagemLadoA = porcentagemLadoPorId
    #     self.PorcentagemLadoB = porcentagemLadoContrario

    # def ObterPorcentagemLadoPorId(idLado: int):
    #     if idLado == 1:
    #         return self.PorcentagemLadoA
    #     else:
    #         return self.PorcentagemLadoB

    # def ObterDadosParaGerarRuleta():
    #     ladoMaior = self.PorcentagemLadoA > self.PorcentagemLadoB
    #     porcentagemMaior = self.PorcentagemLadoA if ladoMaior else self.PorcentagemLadoB
    #     ladoMaiorId = 1 if ladoMaior else 0
    #     ladoContrario = 0 if (ladoMaiorId == 1) else 1

    #     return {
    #         "LadoMaior": ladoMaiorId,
    #         "PorcentagemMaior": porcentagemMaior,
    #         "LadoMenor": ladoContrario,
    #     }
    def obtenerTotalJugadores(self, jugadas: list) -> int:
        
        if len(jugadas) == 0:
            return 0
        
        return len(filter(lambda j: j.fin,jugadas))

    def obterTotalApostado(self, jugadas: list) -> float:

        if len(jugadas) == 0:
            return 0
        jugadasActivas = filter(lambda j: j.fin,jugadas)
        return sum([sum(jugada.ladoA, jugada.ladoB) for jugada in jugadasActivas])

    async def ObterJogadaPorNumeroMesa(self,idNumeroMesa: int):
        jogadaAtivaMesa = self.__session.execute(select(JugadaModel).where(and_(JugadaModel.mesa == idNumeroMesa,JugadaModel.fin == None))).first()
        return jogadaAtivaMesa
    
    
    async def CriarNovaJogada(self,apuesta:Apuesta):
        novaJogada = JugadaModel(
            mesa=apuesta.IdMesa,
            creacion=datetime.now()
        )
        
        if(apuesta.IdLadoApostado == 1):
            novaJogada.ladoA = apuesta.ValorApostado
        else:
            novaJogada.ladoB = apuesta.ValorApostado
            
        self.__session.add(novaJogada)
        self.__session.commit()
        self.__session.refresh(novaJogada)
        return novaJogada

            
             
    async def CriarApuestaJugador(self,apuesta:Apuesta,jugada:JugadaModel):
        valorTotalLado = jugada.ladoA if(apuesta.IdLadoApostado == 1) else jugada.ladoB
        porcentagemJugada = Porcentagem(valorTotalLado).CalcularPorcentagemAReceberPorValor(apuesta.ValorApostado)
        nuevaApuesta = ApuestaModel(
            usuario=apuesta.IdUsuario,
            monto=apuesta.ValorApostado,
            lado=apuesta.IdLadoApostado,
            jugada= jugada,
            porcentaje =porcentagemJugada,
            fecha=datetime.now(),
            
        )
        self.__session.add(nuevaApuesta)
        self.__session.commit()
        self.__session.refresh(nuevaApuesta)
        return nuevaApuesta

    
    async def ObterDetallesMesas(self):
                
        mesas = await (
                self.__session.query(MesaModel)
                .options(joinedload(MesaModel.jugada).joinedload(JugadaModel.apuestas))
                .all())


        return  [{'jugadores':self.obtenerTotalJugadores(mesa.jugada),
                'maximo' : mesa.maximo if mesa.maximo else 0,
                'minimo' : mesa.minimo if mesa.minimo else 0,
                'totalApostado': self.obterTotalApostado(mesa.jugada),
                'numero': mesa.numero
                } for mesa in mesas]


      