export default function Fila({ Jugadores }) {
  return (
    <div className="card bg-dark text-white" style={{ width: "30rem" }}>
      <div className="card-header d-flex justify-content-between">
        <span>Valor Total: R$ 100,00</span>
        <span>50%</span>
      </div>
      <div className="card-body">
        <div className="row">
          <span className="col-9">
            Nombre
          </span>
          <span className="col-2">Valor</span>
          <span className="col-1">%</span>
        </div>
        <Jugador />
        <Jugador />
        <Jugador />
        <Jugador />
        <Jugador />
        <Jugador />
        <Jugador />
      </div>
    </div>
  );
}

const Jugador = () => {
  return (
    <div className="row my-2">
    <span className="col-9">
      <div className="row">
        <div className="col-3">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"
            width={60}
            height={60}
          />
        </div>
        <div className="col-6">nombre</div>
      </div>
    </span>
    <span className="col-2  ">Valor</span>
    <span className="col-1  ">%</span>
  </div>
  );
};
