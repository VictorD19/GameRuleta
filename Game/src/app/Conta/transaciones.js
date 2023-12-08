"use client";
import { executarREST } from "@/Api";
import { useDataContext } from "@/Context";
import { useAuthHook } from "@/Hooks/AuthHook";
import { useRedirectApp } from "@/Hooks/RoutesHooks";
import { useEffect } from "react";
import { Table } from "react-bootstrap";
import { FaArrowCircleDown, FaArrowCircleUp } from "react-icons/fa";

export const Transaciones = () => {
  const { ObterIdUsuariPorToken, SessionLoginActiva } = useAuthHook();
  const {
    appData: { Usuario },
    dispatch,
  } = useDataContext();
  const { IrPara } = useRedirectApp();
  useEffect(() => {
    if (!SessionLoginActiva()) return IrPara();

    (async () => {
      const { error, ...data } = await executarREST(
        `user/transac/${ObterIdUsuariPorToken()}`
      );

      if (error != null)
        return dispatch({
          tipo: "DADOS_USUARIO",
          data: { HistoricoTransiones: [] },
        });

      dispatch({
        tipo: "DADOS_USUARIO",
        data: { HistoricoTransiones: data.ListTransacciones },
      });
    })();
  }, []);
  return (
    <>
      <p
        style={{ fontSize: "0.8em", color: "#c1c1c1" }}
        className="d-flex gap-2"
      >
        <span>
          {" "}
          <FaArrowCircleUp color={"green"} /> - Deposito com successo
        </span>
        <span>
          {" "}
          <FaArrowCircleUp color={"red"} /> - Deposito não processado
        </span>
        <span>
          {" "}
          <FaArrowCircleDown color={"green"} /> - Saque com sucesso
        </span>
        <span>
          {" "}
          <FaArrowCircleDown color={"red  "} /> - Saque com falha
        </span>
      </p>
      <Table striped variant="dark" responsive>
        <thead>
          <tr>
            <th>Data</th>
            <th>Metodo</th>
            <th>Valor (R$)</th>
            <th>Transaciones</th>
          </tr>
        </thead>
        <tbody>
          {Usuario.HistoricoTransiones.map((transacione, index) => (
            <tr key={"transacion_" + index}>
              <td>
                {transacione.fechaPagado != null
                  ? new Date(transacione.fechaPagado).toLocaleString()
                  : new Date(transacione.fechaCreado).toLocaleString()}
              </td>
              <td>Pix</td>
              <td>{parseFloat(`${transacione.monto}`).toFixed(2)}</td>

              <td>
                {transacione.tipo == "entrada" ? (
                  <FaArrowCircleUp
                    color={transacione.status ? "green" : "red"}
                  />
                ) : (
                  <FaArrowCircleDown
                    color={transacione.status ? "green" : "red"}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};
