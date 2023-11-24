import os
import smtplib
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import smtplib, ssl
import email.message
from email import encoders
import email.utils as utils

from dotenv import load_dotenv

load_dotenv()




class Send_Mail:

    def __init__(self, destino, asunto, mensaje, adj=False, img='Qr.jpeg'):
        self.destino = destino
        self.asunto = asunto
        self.mensaje = mensaje
        self.user = os.getenv("EMAIL_INFO_RULETA")
        self.password = os.getenv("PASSWORD_INFO_RULETA")
        self.smtp_server = 'smtpout.secureserver.net'
        self.port = 465
        self.adj = adj
        self.img = img
        self.n_adj = 'Qr.jpeg'


    def message(self):
        
        msn = MIMEMultipart()
        msn['message-id'] = utils.make_msgid(domain='sotemtec.com')
        msn['Subject'] = self.asunto
        msn['From'] = self.user
        msn['To'] = self.destino
        msn.add_header('Content-Type', 'text/html')
        msn.attach(MIMEText(self.mensaje, 'html'))

        if self.adj:       
         
            adjunto_MIME = MIMEBase('application', 'octet-stream')
            adjunto_MIME.set_payload((open(self.img, 'rb')).read())
            encoders.encode_base64(adjunto_MIME)
            msn.attach(
                adjunto_MIME.add_header(
                    'Content-Disposition', f"attachment; filename= {self.n_adj}"
                )
            )
        return msn

    def send(self):

        try:
            

            context = ssl.create_default_context()            
            with smtplib.SMTP_SSL(self.smtp_server, self.port, context=context) as server:
                server.login(self.user, self.password)
                server.sendmail(self.user, self.destino, self.message().as_string())

            return True

        except Exception as e:
            print("Send_Mail error >>>>>>> ", e)
            return False
        