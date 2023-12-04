"use client";

import { executarREST } from "@/Api";
import { useDataContext } from "@/Context";
import { useAuthHook } from "@/Hooks/AuthHook";
import { useState } from "react";
import { Button, Form, FormControl } from "react-bootstrap";
import { CriarAlerta, TIPO_ALERTA } from "../Alertas/Alertas";
import { useSearchParams } from "next/navigation";

export const CuadroAposta = ({ idMesa }) => {
  const [valor, setValor] = useState(0);
  const { SessionLoginActiva } = useAuthHook();
  const { appData, loginsMethod, dispatch, loading } = useDataContext();
  const { Usuario } = appData;
  const params = useSearchParams();
  const roomAtual = params.get("room");

  const obterValorInserido = (e) => {
    if (e.target.value == "") return setValor(0);
    let valor = Number(e.target.value) * 1;
    setValor((aux) => valor);
  };

  const ApostarLadoA = async () => {
    if (!SessionLoginActiva()) {
      CriarAlerta(
        TIPO_ALERTA.ATENCAO,
        null,
        "Entre na sua conta e começe a JOGAR AGORA!"
      );
      loginsMethod.abrirModalLogin();
      return;
    }

    if (valor <= 0)
      return CriarAlerta(
        TIPO_ALERTA.ATENCAO,
        null,
        "Insira um valor maior que 0"
      );
    const novaAposta = {
      IdUsuario: Usuario.Id,
      ValorApostado: valor,
      IdLadoApostado: 1,
      IdMesa: Number(roomAtual), // Azul
    };
    loading.ativarLoading();
    const { error } = await executarREST(
      "apuestas/hacer-apuesta/",
      "POST",
      novaAposta
    );
    loading.desativarLoading();
    if (error != null) return CriarAlerta(TIPO_ALERTA.ERROR, null, error);
    
    dispatch({
      tipo: "DADOS_USUARIO",
      data: { Saldo: (Usuario.Saldo - valor).toFixed(2) },
    });
    CriarAlerta(TIPO_ALERTA.SUCESSO, null, "Apuesta Realizada com sucesso!");
    setValor(0);
  };

  const ApostarLadoB = async () => {
    if (!SessionLoginActiva()) {
      CriarAlerta(
        TIPO_ALERTA.ATENCAO,
        null,
        "Entre na sua conta e começe a JOGAR AGORA!"
      );
      loginsMethod.abrirModalLogin();
      return;
    }
    if (valor <= 0)
      return CriarAlerta(
        TIPO_ALERTA.ATENCAO,
        null,
        "Insira um valor maior que 0"
      );
 
    const novaAposta = {
      IdUsuario: Usuario.Id,
      ValorApostado: valor,
      IdLadoApostado: 2,
      IdMesa: Number(roomAtual),
    };
    loading.ativarLoading();
    const { error } = await executarREST(
      "apuestas/hacer-apuesta/",
      "POST",
      novaAposta
    );
    loading.desativarLoading();
    if (error != null) return CriarAlerta(TIPO_ALERTA.ERROR, null, error);
    dispatch({
      tipo: "DADOS_USUARIO",
      data: { Saldo: (Usuario.Saldo - valor).toFixed(2) },
    });
    CriarAlerta(TIPO_ALERTA.SUCESSO, null, "Apuesta Realizada com sucesso!");
    setValor(0);
  };

  const aumentar = (valorAumentar) => {
    setValor((atual) => atual + valorAumentar);
  };

  return (
    <div className=" col-sm-12 col-md-4 mt-4 mt-md-0">
      <div className="card bg-dark" style={{ height: "100%" }}>
        <div className="card-header text-white text-center">APOSTAR AGORA</div>
        <div className="card-body p-4 ">
          <Form className="d-flex flex-column align-items-center">
            <FormControl
              type="number"
              className="form-control my-3 w-100 "
              id="montaApuesta"
              onChange={obterValorInserido}
              value={valor}
            />
            <div className="d-flex justify-content-between gap-2  w-100 mb-2">
              <Button
                size="sm"
                variant="outline-warning"
                className="w-100"
                onClick={() => aumentar(5)}
              >
                +5
              </Button>
              <Button
                size="sm"
                variant="outline-warning"
                className="w-100"
                onClick={() => aumentar(10)}
              >
                +10
              </Button>
              <Button
                size="sm"
                variant="outline-warning"
                className="w-100"
                onClick={() => aumentar(25)}
              >
                +25
              </Button>
              <Button
                size="sm"
                variant="outline-warning"
                className="w-100"
                onClick={() => aumentar(50)}
              >
                +50
              </Button>
              <Button
                size="sm"
                variant="outline-warning"
                className="w-100"
                onClick={() => aumentar(100)}
              >
                +100
              </Button>
            </div>
            <div className="row w-100 ">
              <div className="col-6  p-0  mt-md-0">
                <Button
                  onClick={ApostarLadoA}
                  className="p-2"
                  style={{ width: "99%", fontSize: "0.8em" }}
                >
                  AZUL
                </Button>
              </div>
              <div className="col-6 p-0">
                <Button
                  variant="danger"
                  className="p-2"
                  style={{ width: "99%", fontSize: "0.8em" }}
                  onClick={ApostarLadoB}
                >
                  VERMELHO
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};
