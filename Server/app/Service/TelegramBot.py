import os
import requests
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv("TOKEN_TELEGRAM")
CHAT_ID = os.getenv("IDCHANNEL_TELEGRAM")


def send_mensaje_telegram(mensaje):
    requests.get(
        url=f"https://api.telegram.org/bot{TOKEN}/sendMessage?chat_id={CHAT_ID}&text={mensaje}"
    )


# Obtener ID Canal
# url = f"https://api.telegram.org/bot{TOKEN}/getUpdates"
# print(requests.get(url).json())
