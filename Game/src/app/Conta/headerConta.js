'use client'
import { InputFile } from "@/Components/InputFile/InputFile";
import { Button, Form, InputGroup } from "react-bootstrap";
import Image from "next/image";
import { useDataContext } from "@/Context";
const style = {
  borderRadius: "10%",
};
export const HeaderConta = () => {
  const {
    appData: { Usuario },
  } = useDataContext();
  return (
    <div className="row align-items-center justify-content-center">
      <div className="col-12 col-md-2 text-center">
        <Image
          src={Usuario.FotoAvatar}
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
                value={Usuario.Nombre}
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
                value={"***********"}
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </div>

          <div className="col-12 col-md-2">
            <Form.Label htmlFor="DataCreacion">Cuenta Creada:</Form.Label>
            <Form.Control
              id="DataCreacion"
              disabled
              placeholder={Usuario.DataCreacion}
              aria-describedby="basic-addon1"
            />
          </div>
          <div className="col-12 col-md-4 mt-2 mt-md-0">
            <InputFile />
          </div>
        </form>
      </div>
    </div>
  );
};
