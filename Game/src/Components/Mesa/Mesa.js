"use client";
import { Button, ProgressBar } from "react-bootstrap";
import Relogio from "../../Assert/border-relogio.svg";
import "./style.css";
import Image from "next/image";
import { AiFillTrophy } from "react-icons/ai";
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import Azul from "../../Assert/fichaAzul.svg";
import Rojo from "../../Assert/fichaRojo.svg";
import { useDataContext } from "@/Context";
import LoadingRelogion from "../../Assert/loadinEspera.svg";
import { executarREST } from "@/Api";
import { CriarAlerta, TIPO_ALERTA } from "../Alertas/Alertas";
import { useAuthHook } from "@/Hooks/AuthHook";
import { Ganador } from "../Ganador";
const RuletaComponente = styled.div`
  position: relative;
  width: 100%;
  height: 10rem;
  overflow: hidden;
  .indicador {
    position: absolute;
    left: 50%;
    z-index: 99;
    width: 2px;
    background: #fff;
    height: 100%;
  }
`;
const RuletaItems = styled.div`
  display: flex;
  transition: transform 3s ease-out;
  align-items: center;
  height: 100%;

  .ladoItem {
    border: 1px solid #c1c1c1;
    border-radius: 10px;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #ccc;
  }
`;

const numbersArray = Array.from({ length: 100 }, (_, index) => index + 1);

// Trigger the animatio
export function Mesa() {
  const [ruletaItems, setItemRuleta] = useState([]);
  const [exibirGanhador, setGanhador] = useState(true);
  const ruletaRef = useRef(null);
  const { SessionLoginActiva } = useAuthHook();
  const {
    appData: { SalaAtual, Usuario },
    ruletaState,
    dispatch,
  } = useDataContext();

  useEffect(() => {
    let dataAtual = new Date();
    let dataUltimaPartida =
      SalaAtual.UltimaNotificacaoFinJogada != ""
        ? new Date(SalaAtual.UltimaNotificacaoFinJogada)
        : new Date();

    var diferencaEmMilissegundos = Math.abs(dataAtual - dataUltimaPartida);
    if (diferencaEmMilissegundos / 1000 > 10) return;
    ruletaState.setRuletaActiva(true);
    setItemRuleta(SalaAtual.RuletaGenerada);

    setTimeout(() => {
      spinRoulette(SalaAtual.IndiceGanador);
      setTimeout(() => {
        setItemRuleta([]);
        (async () => {
          if (!SessionLoginActiva()) return;
          const { error, ...data } = await executarREST(
            "user/saldo-cliente/" + Usuario.Id,
            "GET"
          );

          if (error != null) return CriarAlerta(TIPO_ALERTA.ERROR, null, error);

          dispatch({
            tipo: "DADOS_USUARIO",
            data: { Saldo: data.account + data.ganancias },
          });
        })();
        ruletaState.setRuletaActiva(false);
        setTimeout(() => {
          setGanhador(true);
          setTimeout(() => {
            setGanhador(false);
          }, 2000);
        }, 1000);
      }, 5000);
    }, 100);

    return () => setItemRuleta([]);
  }, [SalaAtual.UltimaNotificacaoFinJogada]);

  function spinRoulette(numeroRandom) {
    const rotation = numeroRandom * -50;
    if (!ruletaRef || !ruletaRef.current) return;
    ruletaRef.current.style.transform = `translateX(${rotation}px)`;
  }
  return (
    <div className="col-sm-12 col-md-8">
      <div className="card bg-dark ">
        <div className="card-body py-4  d-flex flex-column">
          {ruletaItems.length > 0 ? (
            <RuletaComponente id="Ruleta">
              <span className="indicador"></span>
              <span className="indicador-end"></span>
              <RuletaItems id="ruletaItems" ref={ruletaRef}>
                {ruletaItems.map((lado, i) => (
                  <RuletaItem lado={lado} key={i} />
                ))}
              </RuletaItems>
            </RuletaComponente>
          ) : SalaAtual.JugadoresA.length == 0 &&
            SalaAtual.JugadoresB.length == 0 ? (
            <div
              style={{ height: "12rem" }}
              className="text-white d-flex justify-content-center align-items-center"
            >
              <h2>Aguardandos Jogadores...</h2>
              <Image
                src={LoadingRelogion}
                alt="loadin sala"
                width={85}
                height={85}
              />
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-between mx-3 mb-3 align-items-center ">
                <div className="position-relative">
                  <Image src={Relogio} alt="loading" width={100} height={100} />
                  <h2 className="position-absolute top-50 start-50 translate-middle">
                    {SalaAtual.SegundosRestantes >= 0
                      ? SalaAtual.SegundosRestantes
                      : 30}
                  </h2>
                </div>
                <div className="text-center text-white">
                  <span>
                    Total a Ganhar <AiFillTrophy color="gold" />
                  </span>
                  <h1>R$ {SalaAtual.TotalApostado}</h1>
                </div>
              </div>
              <ProgressBar style={{ height: "2rem" }}>
                <ProgressBar
                  animated
                  striped
                  variant="primary"
                  now={SalaAtual.PorcentagemA}
                  label={`${SalaAtual.PorcentagemA}%`}
                  key={1}
                />
                <ProgressBar
                  animated
                  striped
                  variant="danger"
                  now={SalaAtual.PorcentagemB}
                  label={`${SalaAtual.PorcentagemB}%`}
                  key={2}
                />
              </ProgressBar>
            </>
          )}
        </div>
      </div>
      {exibirGanhador && <Ganador />}
    </div>
  );
}

const RuletaItem = ({ lado }) => {
  return (
    <div className="">
      <Image
        src={lado == 1 ? Azul : Rojo}
        alt="lado hg"
        width={70}
        height={70}
        style={{ backgroundImage: "content" }}
      />
    </div>
  );
};
