
from fastapi import Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
class ResponseRequest:
    def __init__(self) -> None:
        pass
    
    def CrearRespuestaSucesso(self,data:any,status_code=200):
        try:
            conteudoSerealizado = jsonable_encoder({
                "data": data
            })
            return JSONResponse(content=conteudoSerealizado,status_code=status_code)
        except Exception as ex:
            return JSONResponse(content={"Message": "Ocorreu uma falha"}, status_code=400)

    def CrearRespuestaError(self,message:str, status_code = 400):
            return JSONResponse(content={"Message": message},status_code=status_code)

