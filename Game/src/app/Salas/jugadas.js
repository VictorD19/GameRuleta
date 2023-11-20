"use client";
import Fila from "@/Components/FilasUsuarios/filas";
import Historico from "@/Components/Historico/Historico";
import { useDataContext } from "@/Context";

export const Jugadas = () => {
  const {
    appData: { SalaAtual },
  } = useDataContext();
  return (
    <div className="row semMarginRow">
      <Fila Jugadores={SalaAtual.JugadoresA} porcentagem={SalaAtual.PorcentagemA} totalLado={SalaAtual.TotalLadoA}/>
      <Fila Jugadores={SalaAtual.JugadoresB} color="danger" porcentagem={SalaAtual.PorcentagemB} totalLado={SalaAtual.TotalLadoB}/>
      <Historico historicos={SalaAtual.HistoricoPartidas} />
    </div>
  );
};
