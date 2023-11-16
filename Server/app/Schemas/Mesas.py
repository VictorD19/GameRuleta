from pydantic import BaseModel

class MesaStatus(BaseModel):
    jugadores : int
    minimo : int
    maximo : int
    totalApostado :float
    numero :int


class ListMesas(BaseModel):
    mesas : list[MesaStatus]
    