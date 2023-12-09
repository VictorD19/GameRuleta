"use client";
import { Table } from "react-bootstrap";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { AiFillTrophy } from "react-icons/ai";
import { useDataContext } from "@/Context";
import { useAuthHook } from "@/Hooks/AuthHook";
import { useRedirectApp } from "@/Hooks/RoutesHooks";
import { useEffect } from "react";
import { executarREST } from "@/Api";
import { ObterDadosLado } from "../Cores";

export const Partidas = () => {
  const { appData, dispatch, loading } = useDataContext();
  const { Usuario, Partidas } = appData;

  const { SessionLoginActiva, ObterIdUsuariPorToken } = useAuthHook();
  const { IrPara } = useRedirectApp();
  useEffect(() => {
    if (!SessionLoginActiva()) return IrPara();

    (async () => {
      const partidas = await executarREST(
        "user/apuestas-jugador/" + ObterIdUsuariPorToken(),
        "GET"
      );
      if (partidas.error) return loading.desativarLoading();
      dispatch({ tipo: "PARTIDAS", data: partidas });
      loading.desativarLoading();
    })();
  }, [Usuario.Id]);
  return (
    <Table striped variant="dark" responsive>
      <thead>
        <tr>
          <th>Lado</th>
          <th>Data</th>
          <th>Valor (R$)</th>
          <th>%</th>
          <th>
            <AiFillTrophy color="gold" />
          </th>
        </tr>
      </thead>
      <tbody>
        {Partidas.map((partida, id) => (
          <tr key={"partida_" + id}>
            <td>{ObterDadosLado(partida.lado).Icon}</td>
            <td>{new Date(partida.fecha).toLocaleString()}</td>
            <td>{partida.resultado ?"+ " : "- "}R$ {parseFloat(partida.monto).toFixed(2)}</td>
            <td>{partida.porcentaje}%</td>
            <td>
              <FaCheckCircle color={partida.resultado ? "green" : "red"} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
