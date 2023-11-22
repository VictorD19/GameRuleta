from Service.MesaServicio import *
from Models.model import Session
from Schemas.Apuesta import Apuesta
from Schemas.Response import ResponseRequest
from Schemas.Exection import ControllerException
from Service.MesaServicio import Mesa as MesaService
from Service.Ruleta import Ruleta
import json


class ApuestaController:
    
    def __init__(self, session: Session) -> None:
        self.__session = session
        self.__MesaService = MesaService(session)

    async def HacerApuesta(self, apuesta: Apuesta):
        try:
            existeJogadaAtiva = await self.__MesaService.ObterJogadaPorNumeroMesa(
                apuesta.IdMesa
            )

            if existeJogadaAtiva == None:
                existeJogadaAtiva = await self.__MesaService.CriarNovaJogada(apuesta)
            else:
                self.__MesaService.ObterNovoValorTotalDoLadoApostado(
                    apuesta.ValorApostado, existeJogadaAtiva, apuesta.IdLadoApostado
                )

            nuevaApuesta = await self.__MesaService.CriarApuestaJugador(
                apuesta, jugada=existeJogadaAtiva
            )
            self.__session.commit()

            return ResponseRequest().CrearRespuestaSucesso({"Status": "ok"})

        except ControllerException as ex:
            self.__session.rollback()
            return ResponseRequest().CrearRespuestaError(str(ex))
        except Exception as ex:
            self.__session.rollback()
            return ResponseRequest().CrearRespuestaError(
                "Não foi possivel Processar a requisição"
            )
        finally:
            self.__session.close()

    async def GenerarPartida(self, idMesa: int):
        try:
            existeJogadaAtiva = await self.__MesaService.ObterJogadaPorNumeroMesa(
                idMesa
            )
            servicoRuleta = Ruleta(existeJogadaAtiva)

            await servicoRuleta.GenerarRuleta()
            ganador = servicoRuleta.ObterGanador()
            self.__MesaService.PagarJugadoresGanador(existeJogadaAtiva, ganador.idLado)
            
            return ResponseRequest().CrearRespuestaSucesso({"Status": "ok"})
        except ControllerException as ex:
            self.__session.rollback()
            return ResponseRequest().CrearRespuestaError(str(ex))
        except Exception as ex:
            self.__session.rollback()
            return ResponseRequest().CrearRespuestaError(
                "Não foi possivel Processar a requisição"
            )
        finally:
            self.__session.close()
