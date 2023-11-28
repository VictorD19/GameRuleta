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
    <Table striped variant="dark" responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Metodo</th>
          <th>Valor (R$)</th>
          <th>Data</th>
          <th>Entrada / Saida</th>
        </tr>
      </thead>
      <tbody>
        {Usuario.HistoricoTransiones.map((transacione, index) => (
          <tr key={"transacion_" + transacione.id}>
            <td>{transacione.id}</td>
            <td>{transacione.metodo}</td>
            <td>{transacione.valor}</td>
            <td>{transacione.data}</td>
            <td>
              {transacione.entrada ? (
                <FaArrowCircleUp color="green" />
              ) : (
                <FaArrowCircleDown color="red" />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
