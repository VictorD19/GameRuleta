from Service.MinasService import MinasService
from Service.datetime_now import datetime_local_actual
from Schemas.MinasSchema import MinasApuesta
from Models.model import ApuestaMinasModel, UserModel
from sqlalchemy.orm import Session


class MinasController:
    def __init__(
        self, minas_apuesta: MinasApuesta, session: Session, user: UserModel
    ) -> None:
        self.minas_apuesta = minas_apuesta
        self.session = session
        self.minas_service = MinasService()
        self.user = user

    def descontarSaldo(self, apuesta) -> None:
        # Descuenta el saldo del clinte
        try:
            # Si tiene saldo suficiente en account lo descuenta solo de hay
            if self.user.account >= self.apuesta.ValorApostado:
                self.user.account -= self.apuesta.ValorApostado
                # Asignamos los gastos en los campos para saber de donde salio
                # el dinero para realizar la apuesta
                apuesta.gastoAccount = self.apuesta.ValorApostado
                apuesta.gastoGanancia = 0
                self.session.commit()
                self.session.refresh(self.user)
                return
            # Si tiene saldo de las ganancias lo descuenta solo de hay
            if self.user.ganancias >= self.apuesta.ValorApostado:
                self.user.ganancias -= self.apuesta.ValorApostado
                # Asignamos los gastos en los campos para saber de donde salio
                # el dinero para realizar la apuesta
                apuesta.gastoGanancia = self.apuesta.ValorApostado
                apuesta.gastoAccount = 0
                self.session.commit()
                self.session.refresh(self.user)
                return
            # si tiene saldo sufiente combinado descuenta primero de la cuenta y el resto de la ganancias
            apuesta.gastoAccount = self.user.account
            restante = self.apuesta.ValorApostado - self.user.account
            self.user.account = 0
            self.user.ganancias -= restante
            apuesta.gastoGanancia = restante
            self.session.commit()
            self.session.refresh(self.user)
            return
        except Exception as e:
            self.session.rollback()

    def crea_jugada_minas(self):
        try:
            matriz = self.minas_service.generar_matriz(
                minas=self.minas_apuesta.cant_minas
            )
            new_apuesta = ApuestaMinasModel(
                usuario=self.user.id,
                monto=self.minas_apuesta.monto,
                matriz=matriz,
                incio=datetime_local_actual(),
            )
            self.session.add(new_apuesta)
            self.session.commit()
            self.session.refresh(new_apuesta)
            self.descontarSaldo(apuesta=new_apuesta)
            return True
        except Exception as e:
            print(e)
            self.session.rollback()
