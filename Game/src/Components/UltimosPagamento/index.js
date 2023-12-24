import { CardJogador } from "../FilasUsuarios/style.styled";
import Profiles from "../../Assert/Profile";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { executarREST } from "@/Api";

export const UltimosPagamentos = () => {
  const [novosPagamento, setNovosPagamentos] = useState([])
  const obterNovosPagamento = useCallback(() => {
    (async () => {
      const pagamentos = await executarREST("pagamento/pagamentos-realizados/", "GET")

      if (pagamentos.error)
        return setNovosPagamentos([])

      setNovosPagamentos(pagamentos)
    })()
  }, [novosPagamento])


  useEffect(() => {

    obterNovosPagamento();
  }, [])
  return useMemo(
    () => (
      <div className="col-12 col-md-8">
        <div className="card bg-dark text-white">
          <div className="card-header">
            <h5>Ultimos Pagamentos</h5>
          </div>
          <div className="card-body">
            {novosPagamento.map((pagamento, i) => (
              <CardJogador key={"pagamento_" + pagamento.id} className="row my-2 align-items-center">
                <div className="col-3 col-md-1">
                  <Image
                    src={Profiles[pagamento.avatar]}
                    width={50}
                    height={50}
                    alt="NovoUsuairo"
                  />
                </div>
                <div className=" col-6 col-md-5 pt-2 ">
                  <p>{pagamento.usuario}</p>
                </div>
                <div className="col-6 col-md-4 mt-3 mt-md-0">
                  <p>Pix - {pagamento.chavePix}</p>
                </div>
                <div className="col-6 col-md-2 text-end">
                  <p>R$ {parseFloat(`${pagamento.monto}`).toFixed(2)}</p>
                </div>
              </CardJogador>
            ))}
          </div>
        </div>
      </div>
    ),
    [novosPagamento]
  );
};
