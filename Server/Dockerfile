FROM python:3.11

WORKDIR /Server
COPY ./requirements.txt /Server/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /Server/requirements.txt
COPY . .
WORKDIR /Server/app 
#CMD ["hypercorn", "application_path", "/Server/app/main:app", "--reload", "--statsd-host", "0.0.0.0:8000", "--workers", "4"]
#uvicorn main:app --reload --host 0.0.0.0 --port 8000 --workers 4 --ssl-keyfile /etc/CertsFunCombat/privatekey.pem --ssl-certfile /etc/CertsFunCombat/cert.pem
CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000", "--workers", "4", "--ssl-keyfile", "/etc/CertsFunCombat/privatekey.pem", "--ssl-certfile", "/etc/CertsFunCombat/cert.pem" ]
