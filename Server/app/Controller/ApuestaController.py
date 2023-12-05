from Service.MesaServicio import *
from fastapi import HTTPException
from Models.model import Session
from Schemas.Apuesta import Apuesta
from Schemas.Exection import ControllerException
from Service.MesaServicio import Mesa as MesaService
from Service.Ruleta import Ruleta
from Service.datetime_now import datetime_local_actual


class ApuestaController:
    def __init__(self, session: Session, user: UserModel, apuesta: Apuesta) -> None:
        self.session = session
        self.apuesta = apuesta
        self.user = user
        self.mesaServicio = MesaService(session=self.session)

    def validaSaldo(self) -> bool:
        # Validamos si el cliente tiene saldo para hacer la apuesta.

        saldoActual = self.user.account + self.user.ganancias
        if saldoActual == 0:
            raise ControllerException(
                "Seu saldo disponivel é R$ 0,00, Recarregue e começe a JOGAR AGORA!",
            )

        if self.apuesta.ValorApostado > saldoActual:
            raise ControllerException(
                "Você não pode apostar um valor maior que o seu saldo disponivel",
            )
        return True

    def traerMesa(self) -> None:
        # trae la mesa para obtener sus valores.
        try:
            if not (
                mesa := self.session.query(MesaModel)
                .filter(MesaModel.id == self.apuesta.IdMesa)
                .first()
            ):
                return False

            self.mesa = mesa
            return True
        except Exception as ex:
            return False

    def descontarSaldo(self) -> None:
        # Descuenta el saldo del clinte
        try:
            # Si tiene saldo suficiente en account lo descuenta solo de hay
            if self.user.account >= self.apuesta.ValorApostado:
                self.user.account -= self.apuesta.ValorApostado
                self.session.commit()
                self.session.refresh(self.user)
                return
            # Si tiene saldo de las ganancias lo descuenta solo de hay
            if self.user.ganancias >= self.apuesta.ValorApostado:
                self.user.ganancias -= self.apuesta.ValorApostado
                self.session.commit()
                self.session.refresh(self.user)
                return
            # si tiene saldo sufiente combinado descuenta primero de la cuenta y el resto de la ganancias
            restante = self.apuesta.ValorApostado - self.user.account
            self.user.account = 0
            self.user.ganancias -= restante
            self.session.commit()
            self.session.refresh(self.user)
            return

        except Exception as ex:
            self.session.rollback()
            raise ControllerException(
                "Não foi possível entrar nessa jogada, tente novamente.",
            )

    def hacerApuesta(self):
        # Metodo que crea la apuesta dentro de la mesa
        try:
            # validamos si el cliente tiene saldo y si la mesa donde quiere apostar existe
            if not (self.validaSaldo() and self.traerMesa()):
                raise ControllerException(
                    "A mesa que você está tentando jogar não existe"
                )
            
            # validamos que la apuesta esa dentro de los limites aceptados en esa ruleta
            if (self.mesa.minimo > self.apuesta.ValorApostado) or (self.apuesta.ValorApostado > self.mesa.maximo):
                raise ControllerException(
                    "O valor da aposta está fora dos limites aceitos nesta roleta"
                )

            # si la mesa esta abierta entra en este flujo
            if self.mesa.status:
                if not (
                    jugadaActiva := self.mesaServicio.ObterJogadaActivaPorMesa(
                        idMesa=self.apuesta.IdMesa
                    )
                ):
                    raise HTTPException(
                        status_code=400,
                        detail="Não foi possível entrar nessa jogada, tente novamente.",
                    )
                # Actualizamos los valores de la jugada de cada lado
                self.mesaServicio.ObterNovoValorTotalDoLadoApostado(
                    apuesta=self.apuesta, jugada=jugadaActiva
                )

                if not (
                    nuevaApuesta := self.mesaServicio.CriarApuestaJugador(
                        apuesta=self.apuesta, jugada=jugadaActiva
                    )
                ):
                    raise HTTPException(
                        status_code=400,
                        detail="Não foi possível entrar nessa jogada, tente novamente.",
                    )

                jugadaActiva.ruleta = str(Ruleta(jugada=jugadaActiva).GenerarRuleta())

                self.session.commit()
                self.session.refresh(jugadaActiva)
                self.descontarSaldo()

                return
            else:
                # si la mesa esa cerrada entra en este flujo
                if not (
                    jugadaActiva := self.mesaServicio.ObterJogadaActivaPorMesa(
                        idMesa=self.apuesta.IdMesa
                    )
                ):
                    nuevaJugada = self.mesaServicio.CriarNovaJogada(
                        apuesta=self.apuesta
                    )
                    if not (
                        nuevaApuesta := self.mesaServicio.CriarApuestaJugador(
                            apuesta=self.apuesta, jugada=nuevaJugada
                        )
                    ):
                        raise HTTPException(
                            status_code=400,
                            detail="Não foi possível entrar nessa jogada, tente novamente.",
                        )

                    nuevaJugada.ruleta = str(Ruleta(jugada=nuevaJugada).GenerarRuleta())
                    self.session.commit()
                    self.session.refresh(nuevaJugada)
                    self.descontarSaldo()
                    return

                else:
                    # Actualizamos los valores de la jugada de cada lado
                    self.mesaServicio.ObterNovoValorTotalDoLadoApostado(
                        apuesta=self.apuesta, jugada=jugadaActiva
                    )
                    # Si la mesa esta cerrada y no tiene jugada activa entra en este flujo
                    if not self.mesaServicio.validadLadosConApuesta(
                        jugada=jugadaActiva, apuesta=self.apuesta
                    ):
                        # si ambos lados de la mesa no tienen apuestas entra en este flujo
                        if not (
                            nuevaApuesta := self.mesaServicio.CriarApuestaJugador(
                                apuesta=self.apuesta, jugada=jugadaActiva
                            )
                        ):
                            raise HTTPException(
                                status_code=400,
                                detail="Não foi possível entrar nessa jogada, tente novamente.",
                            )

                        jugadaActiva.ruleta = str(
                            Ruleta(jugada=jugadaActiva).GenerarRuleta()
                        )
                        self.session.commit()
                        self.session.refresh(jugadaActiva)
                        self.descontarSaldo()
                        return
                    else:
                        # si la mesa esta cerrada y tiene ambos lados com apuestas entra en este flujo
                        # Activamos la mesa
                        self.mesa.status = True
                        self.session.commit()
                        self.session.refresh(self.mesa)

                        if not (
                            nuevaApuesta := self.mesaServicio.CriarApuestaJugador(
                                apuesta=self.apuesta, jugada=jugadaActiva
                            )
                        ):
                            raise HTTPException(
                                status_code=400,
                                detail="Não foi possível entrar nessa jogada, tente novamente.",
                            )

                        jugadaActiva.ruleta = str(
                            Ruleta(jugada=jugadaActiva).GenerarRuleta()
                        )
                        jugadaActiva.inicio = datetime_local_actual()
                        self.session.commit()
                        self.session.refresh(jugadaActiva)
                        self.descontarSaldo()
                        return

        except ControllerException as ex:
            self.session.rollback()
            raise HTTPException(
                status_code=400,
                detail=str(ex),
            )

        except Exception as ex:
            self.session.rollback()
            raise HTTPException(
                status_code=400,
                detail="Não foi possível entrar nessa jogada, tente novamente.",
            )

        finally:
            self.session.close()
