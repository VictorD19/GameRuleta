"use client";

import { useState } from "react";
import { Button } from "react-bootstrap";

export const CuadroAposta = () => {
  const [valor, setValor] = useState([]);

  const obterValorInserido = (e) => {
    setValor(e.target.value);
  };

  const ApostarLadoA = () => {};

  const ApostarLadoB = () => {};

  return (
    <div className=" col-sm-12 col-md-4 mt-4 mt-md-0">
      <div className="card bg-dark" style={{ height: "100%" }}>
        <div className="card-header text-white text-center">APOSTAR AGORA</div>
        <div className="card-body p-4 d-flex flex-column align-items-center">
          <input
            type="number"
            className="form-control my-3 w-100"
            id="montaApuesta"
            onChange={obterValorInserido}
            value={valor}
          />
          <div className="row w-100 ">
            <div className="col-6 p-0">
              <Button
                variant="danger"
                className="p-2"
                style={{ width: "99%", fontSize: "0.8em" }}
                onClick={ApostarLadoA}
              >
                VERMELHO
              </Button>
            </div>
            <div className="col-6  p-0  mt-md-0">
              <Button
                onClick={ApostarLadoB}
                className="p-2"
                style={{ width: "99%", fontSize: "0.8em" }}
              >
                AZUL
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
