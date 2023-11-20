import { HeaderConta } from "./headerConta";
import { Transaciones } from "./transaciones";

export default function Page() {
  return (
    <div className="px-2">
      <div className="card bg-dark text-white">
        <div className="card-body mb-3 mb-md-0">
          <HeaderConta />

          <h3 className="mt-4">Historico da Conta</h3>
          <Transaciones />
        </div>
      </div>
    </div>
  );
}
