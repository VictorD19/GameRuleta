import { Partidas } from "./partidas";

export default function Page() {
  return (
    <div className="px-2">
      <div className="card bg-dark">
        <div className="card-body  text-white">
          <h3 className="mb-4 ">Historico das 20 ultimas partidas</h3>
          <Partidas />
        </div>
      </div>
    </div>
  );
}
