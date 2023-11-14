'use client'

import { CardJogador } from "./style.styled";

export default function Fila({ Jugadores,color = "primary" }) {
  return (
    <div className=" col-sm-12 col-md-4 mb-4 mb-md-0" >
      <div className="card bg-dark text-white">
      <div className={`card-header d-flex justify-content-between bg-${color}`}>
        <span>Valor Total: R$ 100,00</span>
        <span>50%</span>
      </div>
      <div className="card-body">
        <div className="row">
          <span className="col-7">
            Usuarios
          </span>
          <span className="col-3 text-end" >Valor (R$)</span>
          <span className="col-2 text-end">%</span>
        </div>
        <Jugador />
        <Jugador />
        <Jugador />
        <Jugador />
        <Jugador />
        <Jugador />
        <Jugador />
      </div>
      </div>
    </div>
  );
}

const Jugador = () => {
  return (
    <CardJogador className="row my-2 align-items-center">
    <span className="col-7">
      <div className="row align-items-center">
        <div className="col-3">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"
            width={50}
            height={50}
          />
        </div>
        <div className="col-6">nombre</div>
      </div>
    </span>
    <span className="col-3 valor   text-end">{Math.floor(Math.random() * 1000 + 1).toFixed(2)}</span>
    <span className="col-2 text-end">{Math.floor(Math.random() * 100 + 1)}%</span>
  </CardJogador>
  );
};
