import { MesaComponent } from "../mesa";
import { Jugadas } from "../jugadas";

export default function Page() {
  return (
    <div>
      <MesaComponent idMesa={2} />
      <Jugadas />
    </div>
  );
}
