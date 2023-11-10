"use client";
import { ProgressBar } from "react-bootstrap";
import "./style.css";

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

export function Mesa() {
//  iniciarContador();
  return (
    <div className="col-sm-12 col-md-8"  >
      <div className="card bg-dark ">
      <div className="card-body py-4  d-flex flex-column">
        <div className="d-flex justify-content-between mx-3 mb-3 align-items-center ">
          <div className="clock"></div>
          <div className="text-center text-white">
            <span>Valor Total</span>
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
