"use client";
import { Button, ProgressBar } from "react-bootstrap";
import Relogio from "../../Assert/border-relogio.svg";
import "./style.css";
import Image from "next/image";
import { AiFillTrophy } from "react-icons/ai";
import styled from "styled-components";
import { useRef, useState } from "react";
import Azul from "../../Assert/fichaAzul.svg";
import Rojo from "../../Assert/fichaRojo.svg";

function iniciarContador() {
  const clock = document.getElementsByClassName("clock")[0];
  var segundos = 30;

  var intervalo = setInterval(function () {
    segundos--;

    clock.innerHTML = segundos;

    if (segundos <= 0) {
      clearInterval(intervalo);
    }
  }, 1000);
}

const RuletaComponente = styled.div`
  position: relative;
  width: 100%;
  height: 80px;
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

  function spinRoulette() {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    const rotation = randomNumber * -50;
    ruletaRef.current.style.transform = `translateX(${rotation}px)`;
  }

  return (
    <div className="col-sm-12 col-md-8">
      <div className="card bg-dark ">
        <div className="card-body py-4  d-flex flex-column">
          <RuletaComponente id="Ruleta">
            <RuletaItems id="ruletaItems" ref={ruletaRef}>
              {ruletaItems.map((_, i) => (
                <RuletaItem lado={i % 2 == 0 ? 1 : 0} key={i} />
              ))}
            </RuletaItems>
          </RuletaComponente>

          <Button onClick={RodarRuleta}>Rodar Ruleta</Button>
          <div className="d-flex justify-content-between mx-3 mb-3 align-items-center ">
            <Image src={Relogio} alt="loading" width={100} height={100} />
            <div className="text-center text-white">
              <span>
                Total a Ganhar <AiFillTrophy color="gold" />
              </span>
              <h1>R$ 100,00</h1>
            </div>
          </div>

          <ProgressBar style={{ height: "2rem" }}>
            <ProgressBar
              animated
              striped
              variant="primary"
              now={50}
              label={`${50}%`}
              key={1}
            />
            <ProgressBar
              animated
              striped
              variant="danger"
              now={50}
              label={`${50}%`}
              key={2}
            />
          </ProgressBar>
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
