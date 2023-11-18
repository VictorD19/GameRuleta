from fastapi import Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
import json


class ComplexEncoder(json.JSONEncoder):
    def default(self, obj):
        if hasattr(obj, "__dict__"):
            return obj.__dict__
        elif isinstance(obj, (list, tuple)):
            return [self.default(item) for item in obj]
        else:
            return str(obj)


class ResponseRequest:
    def __init__(self) -> None:
        pass

    def CrearRespuestaSucesso(self, data: any, status_code=200, type="REST"):
        try:
            if type != "REST":
                return json.dumps(data, cls=ComplexEncoder)
            conteudoSerealizado = jsonable_encoder(
                {"data": data if (data != None) else {"response": "ok"}}
            )
            return JSONResponse(content=conteudoSerealizado, status_code=status_code)
        except Exception as ex:
            return JSONResponse(
                content={"Message": "Ocorreu uma falha"}, status_code=400
            )

    def CrearRespuestaError(self, message: str, status_code=400):
        return JSONResponse(content={"Message": message}, status_code=status_code)
