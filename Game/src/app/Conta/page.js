import Image from "next/image";
import Profile from "../../Assert/face-1.png";
import { Button, Form, InputGroup, Table } from "react-bootstrap";
import { FaArrowCircleDown, FaArrowCircleUp } from "react-icons/fa";
import { InputFile } from "@/Components/InputFile/InputFile";

const style = {
  borderRadius: "50%",
};

export default function Page() {
  return (
    <div className="px-2">
      <div className="card bg-dark text-white">
        <div className="card-body mb-3 mb-md-0">
          <div className="row align-items-center justify-content-center">
            <div className="col-12 col-md-2 text-center">
              <Image
                src={Profile}
                alt="usuario"
                width={150}
                height={150}
                style={style}
              />
            </div>
            <div className="col-12 col-md-10 ">
              <form className="row mt-3 mt-md-0">
                <div className="col-12 col-md-3 ">
                  <Form.Label htmlFor="NomeUsuario">Nome Usuario</Form.Label>
                  <InputGroup className="mb-3 ">
                    <Button variant="warning" id="button-addon1">
                      Mudar
                    </Button>
                    <Form.Control
                      id="NomeUsuario"
                      placeholder="Nome Usuario"
                      aria-label="Example text with button addon"
                      aria-describedby="basic-addon1"
                    />
                  </InputGroup>
                </div>
                <div className="col-12 col-md-3">
                  <Form.Label htmlFor="MudarSenha">Mudar Senha</Form.Label>
                  <InputGroup className="mb-3 ">
                    <Button variant="warning" id="button-addon1">
                      Mudar
                    </Button>
                    <Form.Control
                      id="MudarSenha"
                      placeholder="Mudar Senha"
                      aria-describedby="basic-addon1"
                    />
                  </InputGroup>
                </div>

                <div className="col-12 col-md-2">
                  <Form.Label htmlFor="DataCreacion">Cuenta Creada:</Form.Label>
                  <Form.Control
                    id="DataCreacion"
                    disabled
                    placeholder="20/12/2023"
                    aria-describedby="basic-addon1"
                  />
                </div>
                <div className="col-12 col-md-4 mt-2 mt-md-0">
                 <InputFile/>
                </div>
              </form>
            </div>
          </div>

          <h3 className="mt-4">Historico da Conta</h3>
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
              <tr>
                <td>1</td>
                <td>Pix</td>
                <td>100,00</td>
                <td>10/12/2023</td>
                <td>
                  <FaArrowCircleUp color="green" />
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>Cartão Credito</td>
                <td>100,00</td>
                <td>10/12/2023</td>
                <td>
                  <FaArrowCircleDown color="red" />
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
