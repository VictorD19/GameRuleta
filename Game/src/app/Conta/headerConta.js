"use client";
import { InputFile } from "@/Components/InputFile/InputFile";
import { Button, Form, InputGroup } from "react-bootstrap";
import Image from "next/image";
import Profiles from "../../Assert/Profile";
import { useDataContext } from "@/Context";
import { BoxImagenContainer } from "@/Components/LoginRegistro/login.style";
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
          src={Profiles[Usuario.FotoAvatar]}
          alt="usuario"
          width={150}
          height={150}
          style={style}
        />
      </div>
      <div className="col-12 col-md-10 ">
        <form className="row mt-3 mt-md-0">
          <div className="col-12 col-md-4 ">
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
          <div className="col-12 col-md-4">
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

          <div className="col-12 col-md-4">
            <Form.Label htmlFor="DataCreacion">Cuenta Creada:</Form.Label>
            <Form.Control
              id="DataCreacion"
              disabled
              placeholder={Usuario.DataCreacion}
              aria-describedby="basic-addon1"
            />
          </div>

          <div className="col-12 ">
            <h5 className="mt-2">Avatar</h5>
            <div className="d-flex gap-2 flex-wrap">
              {Object.keys(Profiles).map((imageName, index) => (
                Usuario.FotoAvatar != imageName ?
                <div key={"profile" + index} className="rounded">
                  <Image
                    className="rounded"
                    src={Profiles[imageName]}
                    width={70}
                    height={70}
                    alt={"profile" + index}
                  />
                </div> : <></>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
