import os
import json
import requests
from Service.datetime_now import datetime_local_actual
from fastapi import HTTPException
from Schemas.Exection import ControllerException
from Schemas.SchemaUser import RetiroFondos, UserPublic
from datetime import datetime, timedelta
from urllib.parse import urljoin

from dotenv import load_dotenv

load_dotenv()


class AuthenticationAsaas:
    def __init__(self) -> None:
        self.ApiKey = os.getenv("API_KEY_ASAAS")

    def header(self):
        return {"Content-Type": "application/json", "access_token": self.ApiKey}


class NewCobropix(AuthenticationAsaas):
    def __init__(self, monto) -> None:
        self.duedate = datetime_local_actual() + timedelta(days=1)
        self.url = os.getenv("LINK_API_ASAAS")
        self.chavePIX = os.getenv("CHAVE_PIX_ASAAS")
        self.uri = "/v3/pix/qrCodes/static/"
        self.monto = monto
        super().__init__()

    def PIX(self):
        try:
            data = {
                "addressKey": self.chavePIX,
                "description": "Recarga",
                "value": self.monto,
                "format": "ALL",
                "expirationDate": str(self.duedate),
                "expirationSeconds": None,
                "allowsMultiplePayments": False,
            }

            r = requests.post(
                headers=self.header(),
                url=urljoin(self.url, self.uri),
                data=json.dumps(data),
            )
            return json.loads(r.text), r.status_code

        except Exception as ex:
            raise HTTPException(status_code=400, detail=str(ex))


class NewTransferenciaPIX(AuthenticationAsaas):
    def __init__(self, retiro: RetiroFondos, usuario: UserPublic) -> None:
        self.url = os.getenv("LINK_API_ASAAS")
        self.uri = "/v3/transfers"
        self.retiro = retiro
        self.usuario = usuario
        super().__init__()

    def enviarPix(self):
        try:
            data = {
            "value": self.retiro.monto,
            "pixAddressKey": self.retiro.chavePix,
            "pixAddressKeyType": self.retiro.llaveTipo,
            "scheduleDate": None,
            "description": f"Retiro -> {self.usuario.username}",
        }

            r = requests.post(
                url=urljoin(self.url, self.uri),
                data=json.dumps(data),
                headers=self.header(),
            )

            return json.loads(r.text), r.status_code

        except Exception as ex:
            raise HTTPException(status_code=400, detail=str(ex))
