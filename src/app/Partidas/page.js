import { Table } from "react-bootstrap";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
const LADO_A = "❤️";
const LADO_B = "🩵";
export default function Page() {
  return (
    <div className="p-2">
      <h3>Historico das 20 ultimas partidas</h3>
      <Table striped variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>Lado</th>
            <th>Valor (R$)</th>
            <th>%</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>{LADO_A}</td>
            <td>100,00</td>
            <td>23%</td>
            <td><FaCheckCircle color="green"/></td>
          </tr>
          <tr>
            <td>1</td>
            <td>{LADO_A}</td>
            <td>100,00</td>
            <td>23%</td>
            <td><FaExclamationCircle color="red"/></td>
          </tr>
          <tr>
            <td>1</td>
            <td>{LADO_B}</td>
            <td>100,00</td>
            <td>23%</td>
            <td><FaExclamationCircle color="red"/></td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
