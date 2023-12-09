"use client";
import { useAuthHook } from "@/Hooks/AuthHook";
import { useEffect } from "react";
import { Button, Table } from "react-bootstrap";

export default function Page() {
  const { SessionLoginActiva } = useAuthHook();
  useEffect(() => {
    if (!SessionLoginActiva()) return;
  }, []);

  const pagarJogador = async (id) => {};

  const cancelarPagamentoJogador = async (id) => {};
  const pagarTodosOsJogadoresPendentes = async (id) => {};

  return (
    <div className="card bg-dark">
      <div className="card-body">
        <h3>Pagamento Pendetes para ser realizados</h3>
        <p>
          Aqui serão mostrado todos lo pagamento pendiente de los jugadores para
          serem confirmados ser debitados
        </p>

        <Table variant="dark" className="">
          <thead>
            <tr className="text-center">
              <th>Nº</th>
              <th>Usuario</th>
              <th>Data Solicitado</th>
              <th>Valor</th>
              <th>Chave Pix</th>
              <th>Opções</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <th>Nº</th>
              <th>Usuario</th>
              <th>Data</th>
              <th>Valor</th>
              <th>Chave Pix</th>
              <th>
                <Button
                  variant="danger "
                  onClick={() => cancelarPagamentoJogador(1)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="success ms-2"
                  onClick={() => pagarJogador(1)}
                >
                  Pagar
                </Button>
              </th>
            </tr>
          </tbody>
        </Table>
        <div className="d-flex justify-content-center mt-4">
          <Button variant="success" onClick={pagarTodosOsJogadoresPendentes}>
            Pagar Todos
          </Button>
        </div>
      </div>
    </div>
  );
}
