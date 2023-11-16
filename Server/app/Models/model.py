from sqlalchemy import create_engine
from sqlalchemy import ForeignKey
from typing import List
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy.orm import Session
from sqlalchemy.orm import DeclarativeBase
from dotenv import load_dotenv
from datetime import datetime
import os

load_dotenv()

DATABASE_URL =  os.getenv('DATABASE_URL')
engine = create_engine(DATABASE_URL)

def get_session():
    with Session(engine) as session:
        yield session


class Base(DeclarativeBase):
    pass


class UserModel(Base):
    __tablename__ = 'users'
  
    id : Mapped[int] = mapped_column(primary_key=True)
    username :  Mapped[str]
    password : Mapped[str]
    avatar :  Mapped[str] = mapped_column(nullable=True)
    account : Mapped[float] = mapped_column(default=0.0)
    status : Mapped[bool] = mapped_column(default=True)
    codreferencia : Mapped[str] = mapped_column(nullable=True)
    apuestas: Mapped[List["ApuestaModel"]] = relationship(back_populates="usuarioRelacion")


class MesaModel(Base):

    __tablename__ = "mesas"

    id : Mapped[int] = mapped_column(primary_key=True)
    numero : Mapped[int]
    status : Mapped[bool]
    minimo : Mapped[int] = mapped_column(nullable=True)
    maximo : Mapped[int] = mapped_column(nullable=True)
    jugada: Mapped[List["JugadaModel"]] = relationship(back_populates="mesaRelacion")
    

class JugadaModel(Base):

    __tablename__ = "jugadas"

    id : Mapped[int] = mapped_column(primary_key=True)
    mesa : Mapped[int] = mapped_column(ForeignKey("mesas.id"))
    mesaRelacion: Mapped["MesaModel"] = relationship(back_populates="jugada")
    ladoA : Mapped[float] = mapped_column(nullable=True)
    ladoB : Mapped[float] = mapped_column(nullable=True)
    ladoGanador : Mapped[int] = mapped_column(nullable=True)
    creacion : Mapped[datetime] 
    inicio : Mapped[datetime] = mapped_column(nullable=True)
    fin :  Mapped[datetime] = mapped_column(nullable=True)
    apuestas : Mapped[List["ApuestaModel"]] = relationship(back_populates="apuestaRelacion")



class ApuestaModel(Base):

    __tablename__ = "apuestas"

    id : Mapped[int] = mapped_column(primary_key=True)
    jugada : Mapped[int] = mapped_column(ForeignKey("jugadas.id"))
    apuestaRelacion : Mapped["JugadaModel"] = relationship(back_populates="apuestas")
    usuario : Mapped[int] = mapped_column(ForeignKey("users.id"))
    usuarioRelacion : Mapped["UserModel"] = relationship(back_populates="apuestas")
    monto : Mapped[float]
    montoResultado : Mapped[float] = mapped_column(nullable=True)
    porcentaje : Mapped[float] 
    lado : Mapped[int]
    fecha : Mapped[datetime]
    resultado : Mapped[bool] = mapped_column(nullable=True)
    



    



