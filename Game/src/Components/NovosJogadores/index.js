"use client";
import Profiles from "../../Assert/Profile";
import Image from "next/image";
import { CardJogador } from "../FilasUsuarios/style.styled";
import { UltimosPagamentos } from "../UltimosPagamento";
import { useCallback, useEffect, useState } from "react";
import { executarREST } from "@/Api";
export const NovosJogadoresComponent = () => {
  const [novosUsuario, setNovosUsuario] = useState([])
  const obterNovosUsario = useCallback(() => {
    (async () => {
      const usuarios = await executarREST("user/ultimos-usuarios/", "GET")

      if (usuarios.error)
        return setNovosUsuario([])

      setNovosUsuario(usuarios)
    })()
  }, [novosUsuario])


  useEffect(() => {

    obterNovosUsario();
  }, [])
  return (
    <div className="row semMarginRow mt-3 ">
      <UltimosPagamentos />
      <div className="col-sm-12 col-md-4 mt-3 mt-md-0">
        <div className="card bg-dark  text-white">
          <div className="card-header">
            <h5>Sejam bem-vindos novos jogadores</h5>
          </div>
          <div className="card-body">
            {novosUsuario.map((user, i) => (
              <CardJogador key={"novo_" + i} className="row my-2 align-items-center">
                <div className="col-2">
                  <Image
                    src={Profiles[user.avatar]}
                    width={50}
                    height={50}
                    alt="NovoUsuairo"
                  />
                </div>
                <div className="col-10">
                  <p> {user.username}</p>
                </div>
              </CardJogador>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
