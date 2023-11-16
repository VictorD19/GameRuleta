from Service.MesaServicio import *
from fastapi import Depends, HTTPException,Response
from Models.model import Session
from Schemas.Apuesta import Apuesta
from Schemas.Exection import ControllerException
from Service.MesaServicio import Mesa as MesaService
import json

class ApuestaController:

    def __init__(self, session:Session) -> None:
        self.__session = session
        self.__MesaService = MesaService(session)

    async def HacerApuesta(self,apuesta:Apuesta):
        try:
            existeJogadaAtiva = await self.__MesaService.ObterJogadaPorNumeroMesa(apuesta.IdMesa)
   
            if(existeJogadaAtiva == None):
                existeJogadaAtiva = await self.__MesaService.CriarNovaJogada(apuesta)
            
            nuevaApuesta = await self.__MesaService.CriarApuestaJugador(apuesta,jugada=existeJogadaAtiva)
            
            return Response({
                "Status":"OK"
            },status_code=201)
            
        except ControllerException as ex:
            raise HTTPException(
                status_code = 400,
                detail= str(ex),
            ) 
        except Exception as ex:
            print(ex)
            raise HTTPException(
                status_code = 400,
                detail= "Não foi possivel Processar a requisição",
            ) 
        
       
        
    