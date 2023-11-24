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

const RuletaComponente = styled.div`
  position: relative;
  width: 100%;
  height: 10rem;
  overflow: hidden;
`;
const RuletaItems = styled.div`
  display: flex;
  transition: transform 3s ease-out;

  .ladoItem {
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
  const ruletaRef = useRef(null);
  const {
    appData: { SalaAtual },
  } = useDataContext();
  function RodarRuleta() {
    for (let i = 0; i < numbersArray.length; i++) {
      const element = numbersArray[i];
      setItemRuleta((x) => {
        let atuais = x;
        return [...atuais, { element }];
      });
    }
    setTimeout(spinRoulette, 1000);
  }
  useEffect(() => {
    if (
      SalaAtual.RuletaGenerada != null &&
      SalaAtual.RuletaGenerada.length > 0
    ) {
      setItemRuleta(SalaAtual.RuletaGenerada);
      setTimeout(() => {
        spinRoulette(SalaAtual.PosicaoSelecionada);
      }, 1500);
    }
  }, [SalaAtual.RuletaActiva]);

  function spinRoulette(numeroRandom) {
    const rotation = numeroRandom * -50;
    ruletaRef.current.style.transform = `translateX(${rotation}px)`;
  }

  return (
    <div className="col-sm-12 col-md-8">
      <div className="card bg-dark ">
        <div className="card-body py-4  d-flex flex-column">
          {SalaAtual.RuletaActiva ? (
            <RuletaComponente id="Ruleta">
              <RuletaItems id="ruletaItems" ref={ruletaRef}>
                {ruletaItems.map((_, i) => (
                  <RuletaItem lado={i % 2 == 0 ? 1 : 0} key={i} />
                ))}
              </RuletaItems>
            </RuletaComponente>
          ) : SalaAtual.JugadoresA.length == 0 &&
            SalaAtual.JugadoresB.length == 0 ? (
            <></>
          ) : (
            <>
              {" "}
              <div className="d-flex justify-content-between mx-3 mb-3 align-items-center ">
                <Image src={Relogio} alt="loading" width={100} height={100} />
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
    </div>
  );
}

const RuletaItem = ({ lado, key }) => {
  return (
    <div className="" key={key}>
      <Image
        src={lado == 1 ? Azul : Rojo}
        alt="lado hg"
        width={70}
        height={50}
        style={{ backgroundImage: "content" }}
      />
    </div>
  );
};
