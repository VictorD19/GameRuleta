import { CardJogador } from "../FilasUsuarios/style.styled";
import Profiles from "../../Assert/Profile";
import Image from "next/image";
import {useMemo } from "react";

export const UltimosPagamentos = ({ list = [...Array(10)] }) => {
  return useMemo(
    () => (
      <div className="col-12 col-md-8">
        <div className="card bg-dark text-white">
          <div className="card-header">
            <h5>Ultimos Pagamentos</h5>
          </div>
          <div className="card-body">
            {list.map((_, i) => (
              <CardJogador className="row my-2 align-items-center">
                <div className="col-3 col-md-1">
                  <Image
                    src={Profiles["Profile" + (i + 1)]}
                    width={50}
                    height={50}
                    alt="NovoUsuairo"
                  />
                </div>
                <div className=" col-6 col-md-5 pt-2 ">
                  <p>Usuario {i}</p>
                </div>
                <div className="col-6 col-md-4 mt-3 mt-md-0">
                  <p>Pix 706382******</p>
                </div>
                <div className="col-6 col-md-2 text-end">
                  <p>R$ {(Math.random() * 100 + 1).toFixed(2)}</p>
                </div>
              </CardJogador>
            ))}
          </div>
        </div>
      </div>
    ),
    [list]
  );
};
