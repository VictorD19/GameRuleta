import { ObterDadosLado } from "@/app/Cores";

export default function Historico({ historicos = [] }) {
  return (
    <div className="col-sm-12 col-md-4 mb-4 mb-md-0">
      <div className="card bg-dark text-white">
        <div className="card-header">Historicos Partidas</div>
        <div className="card-body">
          <div className="row text-start">
            <span className="col-3">#</span>
            <span className="col-3">Ganhador</span>
            <span className="col-3">Players</span>
            <span className="col-3">Total</span>
          </div>
          {historicos.map((historico, i) => (
            <HistoricoItem historico={historico} key={"historico" + i} />
          ))}
        </div>
      </div>
    </div>
  );
}

const HistoricoItem = ({ historico }) => {
  return (
    <div className="row justify-content-center text-start">
      <span className="col-3">{historico.id}</span>
      <span className="col-3">{ObterDadosLado(historico.Ganador).Icon}</span>
      <span className="col-3">{historico.Jugadores}</span>
      <span className="col-3">R$ {historico.Total}</span>
    </div>
  );
};
