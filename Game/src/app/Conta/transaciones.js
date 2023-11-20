"use client";
import { useDataContext } from "@/Context";
import { Table } from "react-bootstrap";
import { FaArrowCircleDown, FaArrowCircleUp } from "react-icons/fa";

export const Transaciones = () => {
  const {
    appData: { Usuario },
  } = useDataContext();
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
