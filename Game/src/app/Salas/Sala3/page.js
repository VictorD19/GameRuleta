import { Jugadas } from "../jugadas";
import { MesaComponent } from "../mesa";

export default function Page() {
  return (
    <div>
      <MesaComponent idMesa={3} />
      <Jugadas />
    </div>
  );
}
