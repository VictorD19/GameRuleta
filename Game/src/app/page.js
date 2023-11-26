"use client";
import { Button } from "react-bootstrap";
import { EstaditicasJuegoStyled, HeadPaginaPrincialStyle } from "./app.style";

export default function Page() {
  return (
    <div className="px-3">
      <HeadPaginaPrincialStyle>
        <h1>Registre-se e receba um bônus de R$ 50 no se primerio deposito!</h1>
        <h5>
          Escolha uma cor e ganhe dinheiro! Rainbow.com as loterias mais
          vencedoras!
        </h5>
        <Button variant="primary" className=" mt-2 px-5 py-2">
          COMEÇE AGORA
        </Button>
      </HeadPaginaPrincialStyle>
      <EstaditicasJuegoStyled className="row">
        <div className="col-6 col-md-3">
          <div className="preechimento"></div>
          <h4>23</h4>
          <p>Jugadores Activos</p>
        </div>
        <div className="col-6 col-md-3">
          <div className="preechimento"></div>
          <h4>3232</h4>
          <p>Total de Jugadores</p>
        </div>
        <div className="col-6 col-md-3">
          <div className="preechimento"></div>
          <h4>3232</h4>
          <p>Total Pagado</p>
        </div>
        <div className="col-6 col-md-3">
          <div className="preechimento"></div> <h4>3232</h4>
          <p>Total Juego Realizados</p>
        </div>
      </EstaditicasJuegoStyled>
    </div>
  );
}
