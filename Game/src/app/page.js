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
import { useDataContext } from "@/Context";
import { ObterDadosLado } from "./Cores";
export default function Page() {
  const { SessionLoginActiva } = useAuthHook();
  const { loginsMethod } = useDataContext();
  const { IrPara } = useRedirectApp();
  const [dataPage, setPage] = useState({
    jugadoresActivos: 90,
    totalJugadores: 100,
    totalPagado: 2000,
    totalJuegosRealizados: 1200,
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
        <h1>
          Registre-se e receba um bônus de R$ 50 no se primerio deposito de
          R$100!
        </h1>
        <h5>
          Escolha uma cor, ganhe dinheiro! Sua sorte está na roleta. Qual cor
          você vai apostar?
        </h5>
        <Button
          variant="primary"
          className=" mt-2 px-5 py-2"
          onClick={loginsMethod.abrirModalRegistro}
        >
          COMEÇE AGORA
        </Button>
      </HeadPaginaPrincialStyle>
      <EstaditicasJuegoStyled className="row">
        <div className="col-6 col-md-3">
          <div className="preechimento my-2 mt-4 d-flex justify-content-end">
            <FaUserAstronaut size={35} color="#00F566" />
          </div>
          <h4>
            {dataPage.jugadoresActivos > 5 ? dataPage.jugadoresActivos : 10}
          </h4>
          <p>Jugadores Activos</p>
        </div>
        <div className="col-6 col-md-3">
          <div className="preechimento my-2 mt-4 d-flex justify-content-end">
            <FaUserFriends size={35} color="#F2E852" />
          </div>
          <h4>
            {dataPage.totalJugadores > 500 ? dataPage.totalJugadores : 500}
          </h4>
          <p>Total de Jugadores</p>
        </div>
        <div className="col-6 col-md-3">
          <div className="preechimento my-2 mt-4 d-flex justify-content-end">
            <FaMoneyBill size={35} color="#48D904" />
          </div>
          <h4>
            R$ {dataPage.totalPagado > 10000 ? dataPage.totalPagado : 10225}
          </h4>
          <p>Total Pagado</p>
        </div>
        <div className="col-6 col-md-3">
          <div className="preechimento my-2 mt-4 d-flex justify-content-end">
            <FaSync size={35} color="#A31CA6" />
          </div>
          <h4>
            {dataPage.totalJuegosRealizados > 150
              ? dataPage.totalJuegosRealizados
              : 152}
          </h4>
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

     <div className=" mt-3 p-2"> <h5  style={{ color: "#f29a0b" }}>
        Regras do Jogo:
      </h5>
      <ol style={{ padding: 0 }}>
        <li>
          <b style={{ color: "#dc3545" }}>Jogo de 2 lados:</b> O jogo tem dois
          times, um é azul {ObterDadosLado(1).Icon} e o outro é vermelho  {ObterDadosLado(2).Icon}.
        </li>
        <li>
          <b style={{ color: "#dc3545" }}> Apostas:</b> Os jogadores precisam
          fazer apostas escolhendo o lado azul {ObterDadosLado(1).Icon} ou vermelho {ObterDadosLado(2).Icon}. Pelo menos 1 jogador
          de cada lado é necessário.
        </li>
        <li>
          <b style={{ color: "#dc3545" }}>Sorteio:</b>Um sorteio de 30 segundos
          começa assim que há pelo menos 1 jogador de cada lado na mesa.
        </li>
        <li>
          <b style={{ color: "#dc3545" }}>Tempo Limite:</b>Quando os 30 segundos
          acabam, um lado é escolhido como vencedor. Esse lado ganha todas as
          apostas do lado contrario.
        </li>
      </ol>
      <h5 style={{ color: "#f29a0b" }}>Exemplo:</h5>
      <ol style={{ padding: 0 }}>
        <li>
          <b style={{ color: "#dc3545" }}>Lado Azul :{ObterDadosLado(1).Icon}</b> 2 jogadores apostaram,
          um R$ 10 e o outro R$ 50, totalizando R$ 60.
        </li>
        <li>
          <b style={{ color: "#dc3545" }}>Lado Vermelho: {ObterDadosLado(2).Icon}</b> 1 jogador apostou
          R$ 100.
        </li>
        <li>
          <b style={{ color: "#dc3545" }}>Chances de Ganhar:</b>Lado Vermelho {ObterDadosLado(2).Icon} {" "}
          tem 62,5%, e Lado Azul {ObterDadosLado(1).Icon} tem 37,5%, baseado no total apostado de cada
          lado.
        </li>
      </ol>

      <h5 style={{ color: "#f29a0b" }}>Se o Vermelho ganhar: {ObterDadosLado(2).Icon}</h5>
      <p>
        Ele leva todo o dinheiro apostado no lado Azul (R$ 60 + R$ 100) menos
        5%, totalizando R$ 152, ja conseguindo realizar o saque de R$52
      </p>
      <h5 style={{ color: "#f29a0b", fontWeight: "bold" }}>
        Se o Azul ganhar: {ObterDadosLado(1).Icon}
      </h5>
      <p>
        Cada jogador recebe dinheiro proporcional ao que apostou. Por exemplo, o
        jogador que apostou R$ 10 recebe R$ 26,66, e o jogador que apostou R$ 50
        recebe R$ 133,33.
      </p></div>
    </div>
  );
}
