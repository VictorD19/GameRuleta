"use client";
import { Table } from "react-bootstrap";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { AiFillTrophy } from "react-icons/ai";
import { useDataContext } from "@/Context";

export const Partidas = () => {
  const { appData } = useDataContext();
  return (
    <Table striped variant="dark" responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Lado</th>
          <th>Valor (R$)</th>
          <th>%</th>
          <th>
            <AiFillTrophy color="gold" />
          </th>
        </tr>
      </thead>
      <tbody>
        {appData.Partidas.map((partida) => (
          <tr key={"partida_" + partida.id}>
            <td>{partida.id}</td>
            <td>{partida.lado}</td>
            <td>{partida.valor}</td>
            <td>{partida.porcentagem}%</td>
            <td>
              <FaCheckCircle color={partida.gano ? "green" : "red"} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
