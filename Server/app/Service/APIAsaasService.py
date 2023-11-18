import os
import json
import requests

from fastapi import HTTPException
from Schemas.Exection import  ControllerException
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
        self.duedate = datetime.now() + timedelta(days=1)
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
                "allowsMultiplePayments" : False
            }

            r = requests.post(
                headers=self.header(),
                url=urljoin(self.url, self.uri),
                data=json.dumps(data),
            )    
            return json.loads(r.text), r.status_code
        
        except Exception as ex:
            return HTTPException(status_code=400, detail=str(ex))




