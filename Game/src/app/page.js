"use client";
import { Button } from "react-bootstrap";
import { EstaditicasJuegoStyled, HeadPaginaPrincialStyle } from "./app.style";
import {
  FaCalculator,
  FaDoorOpen,
  FaGift,
  FaMoneyBill,
  FaSync,
  FaUserAstronaut,
  FaUserFriends,
} from "react-icons/fa";
import { useEffect } from "react";
import { useState } from "react";
import { executarREST } from "@/Api";
import { useAuthHook } from "@/Hooks/AuthHook";
import { useRedirectApp } from "@/Hooks/RoutesHooks";
export default function Page() {
  const { SessionLoginActiva } = useAuthHook();
  const { IrPara } = useRedirectApp();
  const [dataPage, setPage] = useState({
    jugadoresActivos: 0,
    totalJugadores: 0,
    totalPagado: 0,
    totalJuegosRealizados: 0,
  });
  useEffect(() => {
    if (SessionLoginActiva()) return IrPara("/Salas?room=1");

    (async () => {
      const { error, ...data } = await executarREST(
        "mesas/estadisticas/",
        "GET"
      );
      if (error)
        setPage({
          jugadoresActivos: 10,
          totalJugadores: 100,
          totalPagado: 4000,
          totalJuegosRealizados: 500,
        });
      else setPage(data);
    })();
  }, []);
  return (
    <div className="px-3">
      <HeadPaginaPrincialStyle>
        <h1>Registre-se e receba um bônus de R$ 50 no se primerio deposito!</h1>
        <h5>
          Escolha uma cor, ganhe dinheiro! Sua sorte está na roleta. Qual cor
          você vai apostar?
        </h5>
        <Button variant="primary" className=" mt-2 px-5 py-2">
          COMEÇE AGORA
        </Button>
      </HeadPaginaPrincialStyle>
      <EstaditicasJuegoStyled className="row">
        <div className="col-6 col-md-3">
          <div className="preechimento my-2 mt-4 d-flex justify-content-end">
            <FaUserAstronaut size={35} color="#00F566" />
          </div>
          <h4>{dataPage.jugadoresActivos}</h4>
          <p>Jugadores Activos</p>
        </div>
        <div className="col-6 col-md-3">
          <div className="preechimento my-2 mt-4 d-flex justify-content-end">
            <FaUserFriends size={35} color="#F2E852" />
          </div>
          <h4>{dataPage.totalJugadores}</h4>
          <p>Total de Jugadores</p>
        </div>
        <div className="col-6 col-md-3">
          <div className="preechimento my-2 mt-4 d-flex justify-content-end">
            <FaMoneyBill size={35} color="#48D904" />
          </div>
          <h4>{dataPage.totalPagado}</h4>
          <p>Total Pagado</p>
        </div>
        <div className="col-6 col-md-3">
          <div className="preechimento my-2 mt-4 d-flex justify-content-end">
            <FaSync size={35} color="#A31CA6" />
          </div>
          <h4>{dataPage.totalJuegosRealizados}</h4>
          <p>Total Juego Realizados</p>
        </div>
      </EstaditicasJuegoStyled>

      <h3 className="my-4 text-center">Nossos Diferenciais</h3>
      <EstaditicasJuegoStyled
        className="text-center row"
        style={{ color: "#c1c1c1" }}
      >
        <div className="col-6 col-md-4">
          <div className="preechimento my-2 mt-4  mb-3 d-flex justify-content-center">
            <FaDoorOpen size={35} color="#F2E852" />
          </div>
          <h5>
            Possuimos 3 salas diferente com montos minimos de R$1 até R$10.000
          </h5>
        </div>
        <div className="col-6 col-md-4">
          <div className="preechimento my-2 mt-4  mb-3 d-flex justify-content-center">
            <FaGift size={35} color="#F51100" />
          </div>
          <h5>
            Ganhe bonus por cada indicação relizada, e saque imediatamente!
          </h5>
        </div>
        <div className="col-6 col-md-4">
          <div className="preechimento my-2 mt-4 mb-3 d-flex justify-content-center">
            <FaCalculator size={35} color="#004CF5" />
          </div>
          <h5>
            Nosso algoritmos de seleção é 100% aleatorio garantindo assim a
            imparcialidade na escolha do vencedor{" "}
          </h5>
        </div>
      </EstaditicasJuegoStyled>
    </div>
  );
}
