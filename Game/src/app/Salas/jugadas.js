"use client";
import Fila from "@/Components/FilasUsuarios/filas";
import Historico from "@/Components/Historico/Historico";
import { useDataContext } from "@/Context";
import { useEffect } from "react";

export const Jugadas = () => {
  const {
    appData: { SalaAtual },
  } = useDataContext();
  useEffect(() => {}, [SalaAtual.JugadoresA, SalaAtual.JugadoresB]);
  return (
    <div className="row semMarginRow">
      <Fila
        Jugadores={SalaAtual.JugadoresA}
        porcentagem={SalaAtual.PorcentagemA}
        totalLado={SalaAtual.TotalLadoA}
        lado={1}
      />
      <Fila
        Jugadores={SalaAtual.JugadoresB}
        color="danger"
        porcentagem={SalaAtual.PorcentagemB}
        totalLado={SalaAtual.TotalLadoB}
        lado={2}
      />
      <Historico historicos={SalaAtual.HistoricoPartidas} />
    </div>
  );
};
