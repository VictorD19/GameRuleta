"use client";

import Image from "next/image";
import { CardJogador } from "./style.styled";

export default function Fila({
  Jugadores = [],
  color = "primary",
  totalLado = 0,
  porcentagem = 0,
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
          <div className="row">
            <span className="col-7">Usuarios</span>
            <span className="col-3 text-end">Valor (R$)</span>
            <span className="col-2 text-end">%</span>
          </div>
          {Jugadores.map((jugador, i) => (
            <Jugador jugador={jugador} key={"jugador_" + jugador.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

const Jugador = ({ jugador }) => {
  return (
    <CardJogador className="row my-2 align-items-center">
      <span className="col-7">
        <div className="row align-items-center">
          <div className="col-3">
            <Image src={jugador.imagen} width={50} height={50} />
          </div>
          <div className="col-6">{jugador.nombre}</div>
        </div>
      </span>
      <span className="col-3 valor   text-end">{jugador.valorApostado}</span>
      <span className="col-2 text-end">{jugador.porcentagem}</span>
    </CardJogador>
  );
};
