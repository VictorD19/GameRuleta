"use client";
import Image from "next/image";
import "./style.css";
import Loading from "../../Assert/loading-animated.svg";
import Relogio from "../../Assert/border-relogio.svg";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDataContext } from "@/Context";
import { LoadingComponet } from "../Loading";

const salasDefault = [
  {
    numero: 1,
    minimo: 1,
    maximo: 1000,
    jugadores: 0,
    SegundosRestantes: 0,
    totalApostado: 0,
  },
  {
    numero: 2,
    minimo: 20,
    maximo: 5000,
    jugadores: 0,
    SegundosRestantes: 0,
    totalApostado: 0,
  },
  {
    numero: 3,
    minimo: 100,
    maximo: 10000,
    jugadores: 0,
    SegundosRestantes: 0,
    totalApostado: 0,
  },
];
export default function SalasCard() {
  const [salaActiva, setSalaActiva] = useState(0);
  const route = useRouter();
  const { appData, webservice } = useDataContext();
  const params = useSearchParams();
  const roomAtual = params.get("room");
  useEffect(() => {}, [appData.SalasGerais]);

  const irParaSala = (sala) => {
    route.push(`/Salas?room=${sala}`);
  };

  useEffect(() => {
    if (!roomAtual) return setSalaActiva(0);
    setSalaActiva(roomAtual);

    return () => setSalaActiva(0);
  }, [roomAtual]);

  return (
    <div className="row my-3 semMarginRow cardSalaContainer">
      {appData.SalasGerais.length > 0 &&
        appData.SalasGerais.sort((x, a) => x.numero - a.numero).map(
          (mesa, index) => {
            return (
              <div
                className={`col-sm-12 col-md-4 containerCardSala ${
                  index > 0 ? "mt-3 mt-md-0" : ""
                } `}
                key={"mesa" + mesa.numero}
                style={{ cursor: "pointer" }}
              >
                <div
                  className={`card cardSala  ${
                    salaActiva == mesa.numero
                      ? "SalaActiva"
                      : "bg-dark SalaInativa"
                  }`}
                  onClick={() => irParaSala(index + 1)}
                >
                  <div className="inner p-3 card-body  d-flex justify-content-between text-white">
                    <div className="mt-2">
                      <h4>Sala Nº {mesa.numero}</h4>
                      {mesa.jugadores > 0 ? (
                        <>
                          <div>Jugadores: {mesa.jugadores}</div>
                          <div>Valor Total: R${mesa.totalApostado}</div>
                        </>
                      ) : (
                        <>
                          <div>Valor Min: R$ {mesa.minimo}</div>
                          <div>Valor Max: R$ {mesa.maximo}</div>
                        </>
                      )}
                    </div>
                    {mesa.jugadores > 0 ? (
                      <div className="position-relative">
                        <Image
                          src={Relogio}
                          alt="loading"
                          width={100}
                          height={100}
                        />
                        <h2 className="position-absolute top-50 start-50 translate-middle">
                          {mesa.SegundosRestantes >= 0
                            ? mesa.SegundosRestantes
                            : 30}
                        </h2>
                      </div>
                    ) : (
                      <>
                        <Image
                          src={Loading}
                          alt="loading"
                          width={100}
                          height={100}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          }
        )}
      {appData.SalasGerais.length == 0 &&
        salasDefault.map((mesa, index) => {
          return (
            <div
              className={`col-sm-12 col-md-4 ${
                index > 0 ? "mt-2 mt-md-0" : ""
              } `}
              key={"mesa" + mesa.numero}
              style={{ cursor: "pointer" }}
            >
              <div
                className={`card  ${
                  salaActiva == mesa.numero
                    ? "SalaActiva"
                    : "bg-dark SalaInativa"
                }`}
                onClick={() => irParaSala(index + 1)}
              >
                <div className="inner p-3 card-body  d-flex justify-content-between text-white">
                  <div className="mt-2">
                    <h4>Sala Nº {mesa.numero}</h4>
                    {mesa.jugadores > 0 ? (
                      <>
                        <div>Jugadores: {mesa.jugadores}</div>
                        <div>Valor Total: R${mesa.totalApostado}</div>
                      </>
                    ) : (
                      <>
                        <div>Apuesta Min: R$ {mesa.minimo}</div>
                        <div>Apuesta Max: R$ {mesa.maximo}</div>
                      </>
                    )}
                  </div>
                  {mesa.jugadores > 0 ? (
                    <div className="position-relative">
                      <Image
                        src={Relogio}
                        alt="loading"
                        width={100}
                        height={100}
                      />
                      <h2 className="position-absolute top-50 start-50 translate-middle">
                        {mesa.SegundosRestantes >= 0
                          ? mesa.SegundosRestantes
                          : 0}
                      </h2>
                    </div>
                  ) : (
                    <>
                      <Image
                        src={Loading}
                        alt="loading"
                        width={100}
                        height={100}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
