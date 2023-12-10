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

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)


def get_session():
    with Session(engine) as session:
        yield session


class Base(DeclarativeBase):
    pass


class UserModel(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str]
    password: Mapped[str]
    avatar: Mapped[str] = mapped_column(nullable=True)
    account: Mapped[float] = mapped_column(default=0.0)
    ganancias: Mapped[float] = mapped_column(default=0.0, nullable= True)
    status: Mapped[bool] = mapped_column(default=True)
    usuarioAdministrador: Mapped[bool] = mapped_column(default=False, nullable= True)
    codreferencia: Mapped[str] = mapped_column(nullable=True)
    codIndicacion: Mapped[str] = mapped_column(nullable=True)
    dataCriacion: Mapped[datetime] = mapped_column(nullable=True)
    email: Mapped[str] = mapped_column(nullable=True)
    apuestas: Mapped[List["ApuestaModel"]] = relationship(
        back_populates="usuarioRelacion"
    )
    transaccionesEntrada: Mapped[List["TransacEntradaModel"]] = relationship(
        back_populates="usuarioTransaccion"
    )
    transaccionesSalida: Mapped[List["TransacSalidaModel"]] = relationship(
        back_populates="usuarioTransaccion"
    )


class MesaModel(Base):
    __tablename__ = "mesas"

    id: Mapped[int] = mapped_column(primary_key=True)
    numero: Mapped[int]
    status: Mapped[bool]
    minimo: Mapped[int] = mapped_column(nullable=True)
    maximo: Mapped[int] = mapped_column(nullable=True)
    jugada: Mapped[List["JugadaModel"]] = relationship(back_populates="mesaRelacion")


class JugadaModel(Base):
    __tablename__ = "jugadas"

    id: Mapped[int] = mapped_column(primary_key=True)
    mesa: Mapped[int] = mapped_column(ForeignKey("mesas.id"))
    mesaRelacion: Mapped["MesaModel"] = relationship(back_populates="jugada")
    ladoA: Mapped[float] = mapped_column(nullable=True)
    ladoB: Mapped[float] = mapped_column(nullable=True)
    ladoGanador: Mapped[int] = mapped_column(nullable=True)
    IndiceGanador: Mapped[int] = mapped_column(nullable=True)
    creacion: Mapped[datetime]
    inicio: Mapped[datetime] = mapped_column(nullable=True)
    fin: Mapped[datetime] = mapped_column(nullable=True)
    ruleta: Mapped[str] = mapped_column(nullable=True)
    apuestas: Mapped[List["ApuestaModel"]] = relationship(
        back_populates="apuestaRelacion"
    )


class ApuestaModel(Base):
    __tablename__ = "apuestas"

    id: Mapped[int] = mapped_column(primary_key=True)
    jugada: Mapped[int] = mapped_column(ForeignKey("jugadas.id"))
    apuestaRelacion: Mapped["JugadaModel"] = relationship(back_populates="apuestas")
    usuario: Mapped[int] = mapped_column(ForeignKey("users.id"))
    usuarioRelacion: Mapped["UserModel"] = relationship(back_populates="apuestas")
    monto: Mapped[float]
    gastoAccount: Mapped[float] = mapped_column(nullable=True, default=0)
    gastoGanancia:Mapped[float] = mapped_column(nullable=True, default=0)
    montoResultado: Mapped[float] = mapped_column(nullable=True)
    porcentaje: Mapped[float]
    lado: Mapped[int]
    fecha: Mapped[datetime]
    resultado: Mapped[bool] = mapped_column(nullable=True)


class TransacEntradaModel(Base):
    __tablename__ = "transaccionesEntrada"

    id: Mapped[int] = mapped_column(primary_key=True)
    usuarioTransaccion: Mapped["UserModel"] = relationship(
        back_populates="transaccionesEntrada"
    )
    usuario: Mapped[int] = mapped_column(ForeignKey("users.id"))
    idExterno: Mapped[str] = mapped_column(nullable=True)
    monto: Mapped[float] = mapped_column(nullable=True)
    fechaCreado: Mapped[datetime]
    fechaPagado: Mapped[datetime] = mapped_column(nullable=True)
    status: Mapped[bool] = mapped_column(default=False)


class TransacSalidaModel(Base):
    __tablename__ = "transaccionesSalida"

    id: Mapped[int] = mapped_column(primary_key=True)
    usuarioTransaccion: Mapped["UserModel"] = relationship(
        back_populates="transaccionesSalida"
    )
    usuario: Mapped[int] = mapped_column(ForeignKey("users.id"))
    idExterno: Mapped[str] = mapped_column(nullable=True)
    monto: Mapped[float] = mapped_column(nullable=True)
    fechaCreado: Mapped[datetime]
    fechaPagado: Mapped[datetime] = mapped_column(nullable=True)
    status: Mapped[bool] = mapped_column(default=False)
