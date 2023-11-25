import { MesaComponent } from "./mesa";
import { Jugadas } from "./jugadas";

export default function Page() {
  return (
    <div className="">
      <MesaComponent idMesa={1} />
      <Jugadas />
    </div>
  );
}
