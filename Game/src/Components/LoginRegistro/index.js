"use client";
import { Button, Form, FormControl } from "react-bootstrap";
import { ModalComponent } from "../Modal/Modal";
import { CriarAlerta, TIPO_ALERTA } from "../Alertas/Alertas";
import { InserirRegistroLocalStorage, executarREST } from "@/Api";
import { useDataContext } from "@/Context";
import Profiles from "../../Assert/Profile";
import Image from "next/image";
import { useState } from "react";
import { BoxImagenContainer } from "./login.style";
import { useRedirectApp } from "@/Hooks/RoutesHooks";

export const LoginModal = ({ show, cerrarModal }) => {
  const { dispatch } = useDataContext();
  const { IrPara } = useRedirectApp();

  const loginApp = async (event) => {
    event.preventDefault();
    let data = event.target;
    const username = data["usuario"].value;
    const password = data["senha"].value;

    if (username.length <= 6 || !password)
      return CriarAlerta(TIPO_ALERTA.ERROR, null, "Usuario e Senha invalidos");

    let { error, access_token } = await executarREST("user/login/", "POST", {
      username,
      password,
    });

    if (error) return CriarAlerta(TIPO_ALERTA.ERROR, null, error);

    InserirRegistroLocalStorage("token", { access_token, data: new Date() });
    dispatch({ tipo: "CONECTADO", data: true });
    IrPara(`/Salas?room=1`);
  };

  return (
    <ModalComponent titulo={"Entrar"} show={show} cerrarModal={cerrarModal}>
      <Form onSubmit={loginApp}>
        <Form.Label htmlFor="usuario">Usuario</Form.Label>
        <FormControl type="text" id="usuario" className="mb-3" required />
        <Form.Label htmlFor="senha">Senha</Form.Label>
        <FormControl type="password" className="mb-2" required id="senha" />
        <div className="links">
          <a
            href="#"
            style={{
              textDecoration: "underline",
              color: "#c1c1c1",
              fontSize: "0.8em",
            }}
          >
            Esqueceu a senha?
          </a>
        </div>

        <Button className="w-100 mt-3" type="submit" variant="success">
          Entrar
        </Button>
      </Form>
    </ModalComponent>
  );
};

export const RegistroModal = ({ show, cerrarModal }) => {
  const [selectedImages, setSelectImage] = useState("");
  const { dispatch } = useDataContext();
  const { IrPara } = useRedirectApp();

  const criarConta = async (event) => {
    event.preventDefault();
    let data = event.target;
    const username = data["usuario"].value;
    const password = data["senha"].value;
    const email = data["email"].value;
    const codReferencia = data["codReferencia"].value;

    if (username.length <= 6 || username.includes(" "))
      return CriarAlerta(
        TIPO_ALERTA.ERROR,
        null,
        "Nome de usuario muito pequeno ou possui ' ' "
      );

    if (password == " " || password.includes(" "))
      return CriarAlerta(
        TIPO_ALERTA.ERROR,
        null,
        "Tipo de senha não valida, sua senha não pode ter espaçoes em branco"
      );

    if (email == "" || !email.includes("@"))
      return CriarAlerta(
        TIPO_ALERTA.ERROR,
        null,
        "Email inserido não é valido!"
      );

    const novoUsuario = {
      username,
      password,
      email,
      avatar: selectedImages,
      codReferencia,
    };

    let dataCriacionUsuario = await executarREST(
      "user/create-user/",
      "POST",
      novoUsuario
    );
    if (dataCriacionUsuario.error != null)
      return CriarAlerta(TIPO_ALERTA.ERROR, null, dataCriacionUsuario.error);

    let { error, access_token } = await executarREST("user/login/", "POST", {
      username,
      password,
    });

    if (error != null) return CriarAlerta(TIPO_ALERTA.ERROR, null, error);

    const dataUsuario = {
      Saldo: dataCriacionUsuario.saldo,
      FotoAvatar: selectedImages,
      Nombre: username,
      DataCreacion: dataCriacionUsuario.dataCriacion,
      Id: dataCriacionUsuario.id,
    };

    InserirRegistroLocalStorage("token", { access_token, data: new Date() });
    dispatch({ tipo: "CONECTADO", data: true });
    dispatch({ tipo: "DADOS_USUARIO", data: dataUsuario });
    IrPara(`/Salas?room=1`);
  };

  const toggleImageSelection = (imageName) => {
    const isSelected = selectedImages == imageName;

    if (isSelected) {
      // Se a imagem já estiver selecionada, remova-a da lista
      setSelectImage("");
    } else {
      // Se a imagem não estiver selecionada, adicione-a à lista
      setSelectImage(imageName);
    }
  };
  return (
    <ModalComponent
      titulo={"Criar Conta"}
      show={show}
      cerrarModal={cerrarModal}
    >
      <Form onSubmit={criarConta}>
        <Form.Label htmlFor="usuario">Nome Usuario</Form.Label>
        <FormControl type="text" className="mb-3" id="usuario" required />
        <Form.Label htmlFor="senha">Senha</Form.Label>
        <FormControl type="password" className="mb-3" id="senha" required />

        <Form.Label htmlFor="email">E-mail</Form.Label>
        <FormControl type="email" required className="mb-3" id="email" />
        <Form.Label htmlFor="codReferencia">Quem te indicou?</Form.Label>
        <FormControl type="text" className="mb-3" id="codReferencia" />

        {/* USUARIO */}
        <h5 className="ml-2">Avatar</h5>
        <BoxImagenContainer>
          {Object.keys(Profiles).map((imageName, index) => (
            <div
              key={"profile" + index}
              className={selectedImages == imageName ? "Selecionado" : ""}
              onClick={() => toggleImageSelection(imageName)}
            >
              <Image
                src={Profiles[imageName]}
                width={85}
                height={85}
                alt={"profile" + index}
              />
            </div>
          ))}
        </BoxImagenContainer>

        <Button className="w-100 mt-3" type="submit" variant="success">
          Criar Conta
        </Button>
      </Form>
    </ModalComponent>
  );
};
