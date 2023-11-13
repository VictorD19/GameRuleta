import { Table } from "react-bootstrap";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { AiFillTrophy } from "react-icons/ai";
const LADO_A = "❤️";
const LADO_B = "🩵";
export default function Page() {
  return (
    <div className="px-2">
      <div className="card bg-dark">
        <div className="card-body  text-white">
          <h3  className="mb-4 ">Historico das 20 ultimas partidas</h3>
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
              <tr>
                <td>1</td>
                <td>{LADO_A}</td>
                <td>100,00</td>
                <td>23%</td>
                <td>
                  <FaCheckCircle color="green" />
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>{LADO_A}</td>
                <td>100,00</td>
                <td>23%</td>
                <td>
                  <FaExclamationCircle color="red" />
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>{LADO_B}</td>
                <td>100,00</td>
                <td>23%</td>
                <td>
                  <FaExclamationCircle color="red" />
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
