export default function Historico() {
  return (
    <div className="card bg-dark text-white" style={{width: "25rem"}}>
      <div className="card-header">Historicos Partidas</div>
      <div className="card-body">
        <div className="row text-start">
          <span className="col-3">#</span>
          <span className="col-3">Ganhador</span>
          <span className="col-3">Players</span>
          <span className="col-3">Total</span>
        </div>

        <HistoricoItem />
        <HistoricoItem />
        <HistoricoItem />
        <HistoricoItem Lado="🩵"/>
        <HistoricoItem Lado="🩵"/>
        <HistoricoItem Lado="🩵"/>
        <HistoricoItem />
        <HistoricoItem />
        <HistoricoItem Lado="🩵"/>
        <HistoricoItem Lado="🩵"/>
        <HistoricoItem Lado="🩵"/>
      </div>
    </div>
  );
}

const HistoricoItem = ({ Lado = "❤️" }) => {
  return (
    <div className="row justify-content-center text-start">
      <span className="col-3">1</span>
      <span className="col-3">{Lado}</span>
      <span className="col-3">{Math.floor(Math.random() * 10 + 1)}</span>
      <span className="col-3">R$ {Math.floor(Math.random() * 100 + 1)}</span>
    </div>
  );
};
