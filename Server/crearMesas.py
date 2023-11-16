
from app.Models.model import MesaModel, Session, engine


def crearMesas():
    session = Session(engine)
    for i in range(1,4):
        mesa = MesaModel(
            numero = i,
            status = True
        )
        session.add(mesa)
        session.commit()
        session.refresh(mesa)

crearMesas()