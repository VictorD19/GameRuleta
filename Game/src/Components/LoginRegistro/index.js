"use client";
import { Button, Form, FormControl } from "react-bootstrap";
import { ModalComponent } from "../Modal/Modal";
import { CriarAlerta, TIPO_ALERTA } from "../Alertas/Alertas";
import {
  InserirRegistroLocalStorage,
  LimparTudoLocalStorage,
  executarREST,
} from "@/Api";
import { useDataContext } from "@/Context";
import Profiles from "../../Assert/Profile";
import Image from "next/image";
import { useState } from "react";
import { BoxImagenContainer } from "./login.style";
import { useRedirectApp } from "@/Hooks/RoutesHooks";
import { useAuthHook } from "@/Hooks/AuthHook";
export const LoginModal = ({ show, cerrarModal }) => {
  const { dispatch, loading, loginsMethod } = useDataContext();
  const { IrPara } = useRedirectApp();
  const { ObterIdUsuariPorToken, SessionLoginActiva } = useAuthHook();
  const [modalSenha, setMoldaSenha] = useState(false);

  const mostrarModalSenha = () => {
    cerrarModal();
    setMoldaSenha(true);
  };
  const cerrarModalSenha = () => setMoldaSenha(false);
  const obterSenhaTemporaria = async (e) => {
    e.preventDefault();
    let formulario = e.target;
    const email = formulario["email"].value;
    if (!email || !email.includes("@"))
      return CriarAlerta(
        TIPO_ALERTA.ERROR,
        null,
        "Precisa informar um email valido!"
      );
    loading.ativarLoading();
    const { error } = await executarREST("user/recuperar-senha/", "POST", {
      email,
    });
    loading.desativarLoading();
    if (error) return CriarAlerta(TIPO_ALERTA.ERROR, null, error);

    CriarAlerta(
      TIPO_ALERTA.SUCESSO,
      null,
      "Recuperação de senha feita com sucesso, uma nova senha sera enviada no seu email!!"
    );
    formulario["email"].value = "";
    cerrarModalSenha();
  };
  const loginApp = async (event) => {
    event.preventDefault();
    let data = event.target;
    const username = data["usuario"].value;
    const password = data["senha"].value;

    if (username.length <= 6 || !password)
      return CriarAlerta(TIPO_ALERTA.ERROR, null, "Usuario e Senha invalidos");
    loading.ativarLoading();
    let { error, access_token } = await executarREST("user/login/", "POST", {
      username,
      password,
    });
    loading.desativarLoading();
    if (error) return CriarAlerta(TIPO_ALERTA.ERROR, null, error);
    loading.ativarLoading();

    let dadoUsuario = await executarREST(
      `user/get/${ObterIdUsuariPorToken(access_token)}`,
      "GET",
      null,
      access_token
    );

    if (dadoUsuario.error != null) {
      LimparTudoLocalStorage();
      dispatch({ tipo: "CONECTADO", data: false });
      CriarAlerta(
        TIPO_ALERTA.ERROR,
        null,
        "Problema ao tentar inciar Sessão tente novamente"
      );
      return;
    }

    const atualizarDados = {
      Id: dadoUsuario.id,
      Saldo: dadoUsuario.saldo,
      FotoAvatar: dadoUsuario.avatar,
      DataCreacion: dadoUsuario.dataCriacion,
      Nombre: dadoUsuario.username,
      Status: dadoUsuario.status,
    };
    InserirRegistroLocalStorage("token", { access_token, data: new Date() });
    dispatch({ tipo: "CONECTADO", data: true });
    dispatch({ tipo: "DADOS_USUARIO", data: atualizarDados });
    loading.desativarLoading();
    IrPara(`/Salas?room=1`);
  };

  return (
    <>
      <ModalComponent titulo={"Entrar"} show={show} cerrarModal={cerrarModal}>
        <Form onSubmit={loginApp}>
          <Form.Label htmlFor="usuario">Usuario</Form.Label>
          <FormControl type="text" id="usuario" className="mb-3" required />
          <Form.Label htmlFor="senha">Senha</Form.Label>
          <FormControl type="password" className="mb-2" required id="senha" />
          <div className="d-flex justify-content-between">
            <Button
              className=" px-0"
              variant="text"
              type="button"
              onClick={mostrarModalSenha}
              style={{
                textDecoration: "underline",
                color: "#c1c1c1",
                fontSize: "0.8em",
              }}
            >
              Esqueceu a senha?
            </Button>
            <Button
              className="px-0"
              onClick={() => {
                loginsMethod.cerrarModalLogin();
                loginsMethod.abrirModalRegistro();
              }}
              style={{
                textDecoration: "underline",
                color: "#c1c1c1",
                fontSize: "0.8em",
              }}
              variant="text"
            >
              Não tem Conta?
            </Button>
          </div>

          <Button className="w-100 mt-3" type="submit" variant="success">
            Entrar
          </Button>
        </Form>
      </ModalComponent>
      <ModalComponent
        titulo={"Recuperação Senha"}
        show={modalSenha}
        cerrarModal={cerrarModalSenha}
      >
        <Form onSubmit={obterSenhaTemporaria}>
          <Form.Label htmlFor="email">Email</Form.Label>
          <FormControl type="text" id="email" className="mb-3" required />

          <div className="d-flex justify-content-end mt-3">
            <Button type="submit" variant="primary">
              Recuperar Senha
            </Button>
          </div>
        </Form>
      </ModalComponent>
    </>
  );
};

export const RegistroModal = ({ show, cerrarModal }) => {
  const [selectedImages, setSelectImage] = useState("Profile1");
  const { dispatch, loading } = useDataContext();
  const { IrPara } = useRedirectApp();

  const criarConta = async (event) => {
    event.preventDefault();
    let data = event.target;
    const username = data["usuario"].value.trim();
    const password = data["senha"].value.trim();
    const email = data["email"].value.trim();
    // const codReferencia = data["codReferencia"].value;

    if (username.length < 6 || username.includes(" "))
      return CriarAlerta(
        TIPO_ALERTA.ERROR,
        null,
        "O nome de usuário é muito pequeno, deve ter pelo menos 6 carácter"
      );

    if (password == " " || password.includes(" ") || password.length < 4)
      return CriarAlerta(
        TIPO_ALERTA.ERROR,
        null,
        "Sua senha deve ter menos 4 caráter"
      );

    if (email == "" || !email.includes("@"))
      return CriarAlerta(
        TIPO_ALERTA.ERROR,
        null,
        "Email inserido não é valido!"
      );

    if (!selectedImages)
      return CriarAlerta(TIPO_ALERTA.ERROR, null, "Selecione um personagem");

    const novoUsuario = {
      username,
      password,
      email,
      avatar: selectedImages,
    };
    loading.ativarLoading();
    let dataCriacionUsuario = await executarREST(
      "user/create-user/",
      "POST",
      novoUsuario
    );
    loading.desativarLoading();
    if (dataCriacionUsuario.error != null)
      return CriarAlerta(TIPO_ALERTA.ERROR, null, dataCriacionUsuario.error);
    loading.ativarLoading();
    let { error, access_token } = await executarREST("user/login/", "POST", {
      username,
      password,
    });
    loading.desativarLoading();
    if (error != null) return CriarAlerta(TIPO_ALERTA.ERROR, null, error);

    const dataUsuario = {
      Saldo: dataCriacionUsuario.saldo,
      FotoAvatar: selectedImages,
      Nombre: username,
      DataCreacion: dataCriacionUsuario.dataCriacion,
      Id: dataCriacionUsuario.id,
    };
    // facebookPixel.track("Lead", dataUsuario);
    loading.ativarLoading();
    InserirRegistroLocalStorage("token", { access_token, data: new Date() });
    dispatch({ tipo: "CONECTADO", data: true });
    dispatch({ tipo: "DADOS_USUARIO", data: dataUsuario });
    loading.desativarLoading();
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
        {/* <Form.Label htmlFor="codReferencia">Quem te indicou?</Form.Label>
        <FormControl type="text" className="mb-3" id="codReferencia" /> */}

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
