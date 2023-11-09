import SalasCard from "@/Components/Salas";
import Fila from "../../Components/FilasUsuarios/filas";
import Historico from "@/Components/Historico/Historico";

export default function Page() {
  return (
    <div className="">
      <SalasCard />

      <div></div>

      <div className="d-flex gap-3" >
        <div className="d-flex gap-3">
        <Fila />
        <Fila />
        </div>
        <Historico/>
      </div>
    </div>
  );
}
