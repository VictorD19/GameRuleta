from pydantic import BaseModel


class MinasApuesta(BaseModel):
    cant_minas: int
    monto: float
