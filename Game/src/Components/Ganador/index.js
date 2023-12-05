import { useDataContext } from "@/Context";
import { ObterDadosLado } from "@/app/Cores";
import Espera from "../../Assert/dust-4.5s-200x200px.gif";
import Image from "next/image";
export const Ganador = () => {
  const { appData, ruletaState, dispatch } = useDataContext();
  const { SalaAtual } = appData;
  return (
    <div className="card bg-dark mt-2">
      <div className="card-body text-center position-relative">
        <h5 style={{ color: "#c1c1c1", zIndex: "4" }}>
          O LADO {ObterDadosLado(SalaAtual.LadoGanador).Icon} GANHOU UM TOTAL DE
        </h5>
        <h1 style={{ fontWeight: "700", zIndex: "4" }}>
          R$ {SalaAtual.UltimoValorTotal.toFixed(2)}
        </h1>
        <Image
          src={Espera}
          alt="espera"
          className="position-absolute top-0 start-0"
          style={{ height: "100%", zIndex: "1" }}
        />

        <Image
          src={Espera}
          alt="espera"
          className="position-absolute top-0 end-50"
          style={{ height: "100%", zIndex: "1" }}
        />
        <Image
          src={Espera}
          alt="espera"
          className="position-absolute top-0 start-50"
          style={{ height: "100%", zIndex: "1" }}
        />
        <Image
          src={Espera}
          alt="espera"
          className="position-absolute top-0 end-0"
          style={{ height: "100%", zIndex: "1" }}
        />
      </div>
    </div>
  );
};
