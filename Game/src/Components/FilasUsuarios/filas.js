"use client";

import Image from "next/image";
import { CardJogador } from "./style.styled";
import Profiles from "../../Assert/Profile";
import CoffieAzul from "../../Assert/Coffee-blue.gif";
import CoffieRojo from "../../Assert/Coffee-red.gif";
export default function Fila({
  Jugadores = [],
  color = "primary",
  totalLado = 0,
  porcentagem = 0,
  lado = 1,
}) {
  return (
    <div className=" col-sm-12 col-md-4 mb-4 mb-md-0">
      <div className="card bg-dark text-white">
        <div
          className={`card-header d-flex justify-content-between bg-${color}`}
        >
          <span>Valor Total: R$ {totalLado}</span>
          <span>{porcentagem}%</span>
        </div>
        <div className="card-body">
          <div className="row" style={{ fontSize: "0.8em" }}>
            <span className="col-7">Usuarios</span>
            <span className="col-3 text-end">Valor (R$)</span>
            <span className="col-2 text-end">%</span>
          </div>

          {Jugadores.length == 0 ? (
            <div className="text-center">
              <Image src={lado == 1 ? CoffieAzul : CoffieRojo} alt="Espera" />
            </div>
          ) : (
            Jugadores.sort((x, b) => b.valorApostado - x.valorApostado).map(
              (jugador, i) => <Jugador jugador={jugador} key={"jugador_" + i} />
            )
          )}
        </div>
      </div>
    </div>
  );
}

const Jugador = ({ jugador }) => {
  return (
    <CardJogador className="row my-2 align-items-center">
      <span className="col-7">
        <div className="row align-items-center gap-2">
          <div className="col-3">
            <Image
              src={Profiles[jugador.imagen]}
              width={50}
              height={50}
              alt="Img_hy"
            />
          </div>
          <div className="col-8" style={{ fontSize: "0.9em" }}>
            {jugador.nombre}
          </div>
        </div>
      </span>
      <span className="col-3 valor   text-end">{jugador.valorApostado}</span>
      <span className="col-2 text-end">{jugador.porcentagem}</span>
    </CardJogador>
  );
};
