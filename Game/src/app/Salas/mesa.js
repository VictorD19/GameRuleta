import { CuadroAposta } from "@/Components/CuadroApuesta/CuadroApuesta";
import { Mesa } from "@/Components/Mesa/Mesa";

export const MesaComponent = () => {
  return (
    <div className="row mb-4 semMarginRow ">
      <Mesa />
      <CuadroAposta />
    </div>
  );
};
