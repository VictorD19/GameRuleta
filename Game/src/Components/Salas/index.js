"use client";
import Image from "next/image";
import "./style.css";
import Loading from "../../Assert/loading-animated.svg";
import Relogio from "../../Assert/border-relogio.svg";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { socket } from "../../Api"
export default function SalasCard() {


  const [salas, setDataSalas] = useState([])


  const route = useRouter();
  let judoresAtivos = true;

  useEffect(() => {
    console.log("passi aqui")
    socket.on("DadosSala", (arg) => {
      alert("Dados sala")
      console.log(arg)
    })
  }, [])

  const irParaSala = (sala) => {
    route.push(`/Salas${sala == 1 ? "" : `/Sala${sala}`}`);
  };
  return (
    <div className="row my-3 semMarginRow">
      <div className="col-sm-12 col-md-4">
        <div className="card bg-dark" onClick={() => irParaSala(1)}>
          <div className="inner p-3 card-body d-flex justify-content-between text-white">
            <>
              <div className="mt-2">
                <h4 className="TituloSala">Sala Nº 1</h4>
                <div>Apuesta Min: R$ 1,00</div>
                <div>Apuesta Max: R$ 200,00</div>
              </div>
              <Image src={Loading} alt="loading" width={100} height={100} />
            </>
          </div>
        </div>
      </div>
      <div className="col-sm-12 col-md-4 mt-4 mt-md-0">
        <div className="card bg-dark" onClick={() => irParaSala(2)}>
          <div className="inner p-3 card-body  d-flex justify-content-between text-white">
            <div className="mt-2">
              <h4 className="TituloSala">Sala Nº 2</h4>
              {judoresAtivos ? (
                <>
                  <div>Jugadores: 10</div>
                  <div>Valor Total: R$ 500,00</div>
                </>
              ) : (
                <>
                  <div>Apuesta Min: R$ 10,00</div>
                  <div>Apuesta Max: R$ 1000,00</div>
                </>
              )}
            </div>
            {judoresAtivos ? (
              <>
                <Image src={Relogio} alt="loading" width={100} height={100} />
              </>
            ) : (
              <>
                <Image src={Loading} alt="loading" width={100} height={100} />
              </>
            )}
          </div>
        </div>
      </div>
      <div className="col-sm-12 col-md-4 mt-4 mt-md-0" onClick={() => irParaSala(3)}>
        <div className="card bg-dark">
          <div className="inner p-3  card-body  d-flex justify-content-between text-white">
            <>
              <div className="mt-2">
                <h4 className="TituloSala">Sala Nº 3</h4>
                <div>Apuesta Min: R$ 500,00</div>
                <div>Apuesta Max: R$ 10000,00</div>
              </div>
              <Image src={Loading} alt="loading" width={100} height={100} />
            </>
          </div>
        </div>
      </div>
    </div>
  );
}
