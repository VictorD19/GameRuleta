from Service.MesaServicio import *
from fastapi import Depends, HTTPException, Response
from Models.model import Session
from Schemas.Apuesta import Apuesta
from Schemas.Response import ResponseRequest
from Schemas.Exection import ControllerException
from Service.MesaServicio import Mesa as MesaService
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
                self.__MesaService.ObterNovoValorTotalDoLadoApostado(apuesta.ValorApostado,existeJogadaAtiva,apuesta.IdLadoApostado)

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
            return ResponseRequest().CrearRespuestaError("Não foi possivel Processar a requisição")
        finally:
            self.__session.close()
