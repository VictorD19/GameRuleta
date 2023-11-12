
import Fila from "../../Components/FilasUsuarios/filas";
import Historico from "@/Components/Historico/Historico";
import { CuadroAposta } from "@/Components/CuadroApuesta/CuadroApuesta";
import { Mesa } from "@/Components/Mesa/Mesa";

export default function Page() {
  return (
    <div className="">

      <div className="row mb-4 semMarginRow ">
        <Mesa />
        <CuadroAposta />
      </div>

      <div className="row semMarginRow">
        <Fila  />
        <Fila color="danger"/>
        <Historico />
      </div>
    </div>
  );
}
