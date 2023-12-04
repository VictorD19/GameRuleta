
from app.Models.model import MesaModel, Session, engine, JugadaModel


def crearMesas():
    session = Session(engine)
    for i in range(1,4):
        mesa = MesaModel(
            numero = i,
            status = False
        )
        session.add(mesa)
        session.commit()
        session.refresh(mesa)

#crearMesas()

session = Session(engine)
jugada = session.query(JugadaModel).filter(JugadaModel.id == 21).first()
jugada.IndiceGanador = 22  
session.commit()
session.refresh(jugada)