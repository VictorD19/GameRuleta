import { CuadroAposta } from "@/Components/CuadroApuesta/CuadroApuesta";
import { Ganador } from "@/Components/Ganador";
import { Mesa } from "@/Components/Mesa/Mesa";

export const MesaComponent = ({ idMesa }) => {
  return (
    <div className="row mb-4 semMarginRow ">
      <Mesa />
      <CuadroAposta idMesa={idMesa} />
    </div>
  );
};
