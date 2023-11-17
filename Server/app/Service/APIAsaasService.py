import os
import json
from datetime import datetime, timedelta
from pprint import pprint
from urllib.parse import urljoin

import requests
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

        return json.loads(r.text) if r.status_code == 200 else False



