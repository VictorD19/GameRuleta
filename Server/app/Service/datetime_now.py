from datetime import datetime
import pytz

def datetime_local_actual():
    # Obtén la hora actual en UTC
    ahora_utc = datetime.utcnow()
    # Define la zona horaria de América/Belem
    zona_horaria_belem = pytz.timezone('America/Belem')
    # Convierte la hora actual a la zona horaria de América/Belem
    return ahora_utc.replace(tzinfo=pytz.utc).astimezone(zona_horaria_belem).replace(tzinfo=None)