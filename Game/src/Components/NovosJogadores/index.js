"use client";
import Profiles from "../../Assert/Profile";
import Image from "next/image";
import { CardJogador } from "../FilasUsuarios/style.styled";
import { UltimosPagamentos } from "../UltimosPagamento";
export const NovosJogadoresComponent = () => {
  return (
    <div className="row semMarginRow mt-3 ">
      <UltimosPagamentos />
      <div className="col-sm-12 col-md-4">
        <div className="card bg-dark  text-white">
          <div className="card-header">
            <h5>Sejam bem-vindos novos jogadores</h5>
          </div>
          <div className="card-body">
            {[...Array(10)].map((_, i) => (
              <CardJogador className="row my-2 align-items-center">
                <div className="col-2">
                  <Image
                    src={Profiles["Profile" + (i + 1)]}
                    width={50}
                    height={50}
                    alt="NovoUsuairo"
                  />
                </div>
                <div className="col-10">
                  <p>Usuario {i}</p>
                </div>
              </CardJogador>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
