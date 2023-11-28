"use client";
import { Button, Form, InputGroup } from "react-bootstrap";
import Image from "next/image";
import Profiles from "../../Assert/Profile";
import { useDataContext } from "@/Context";
import { BoxImagenContainer } from "@/Components/LoginRegistro/login.style";
import { useEffect, useRef, useState } from "react";
import { useAuthHook } from "@/Hooks/AuthHook";
import { useRedirectApp } from "@/Hooks/RoutesHooks";
import { executarREST } from "@/Api";
import { CriarAlerta, TIPO_ALERTA } from "@/Components/Alertas/Alertas";
const style = {
  borderRadius: "10%",
};
export const HeaderConta = () => {
  const {
    appData: { Usuario },
    dispatch,
  } = useDataContext();
  const { SessionLoginActiva } = useAuthHook();
  const { IrPara } = useRedirectApp();
  const [selectedImages, setSelectImage] = useState("");
  const formulario = useRef(null);
  const atualizarNombre = async (e) => {
    e.preventDefault();
    const username = formulario.current["usuario"].value;

    const { error, ...dataResponse } = executarREST(
      "user/update/" + Usuario.Id,
      "PATCH",
      {
        username,
      }
    );

    if (error) return CriarAlerta(TIPO_ALERTA.ERROR, null, error);

    CriarAlerta(
      TIPO_ALERTA.SUCESSO,
      null,
      "Nome de usuario Atualizado com sucesso!"
    );
    dispatch({ tipo: "DADOS_USUARIO", data: { Nombre: username } });
  };
  const atualizarSenha = async (e) => {
    e.preventDefault();
    const password = formulario.current["senha"].value;
    const { error, ...dataResponse } = executarREST(
      "user/update/" + Usuario.Id,
      "PATCH",
      {
        password,
      }
    );

    if (error) return CriarAlerta(TIPO_ALERTA.ERROR, null, error);

    CriarAlerta(TIPO_ALERTA.SUCESSO, null, "Senha Atualizada com Sucesso!");
  };
  const atualizarAvatar = async (e) => {
    e.preventDefault();
    const { error, ...dataResponse } = executarREST(
      "user/update/" + Usuario.Id,
      "PATCH",
      {
        avatar: selectedImages,
      }
    );

    if (error) return CriarAlerta(TIPO_ALERTA.ERROR, null, error);

    CriarAlerta(TIPO_ALERTA.SUCESSO, null, "Avatar Atualizado com Sucesso!");
    dispatch({ tipo: "DADOS_USUARIO", data: { FotoAvatar: selectedImages } });
    setSelectImage("");
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

  useEffect(() => {
    if (!SessionLoginActiva()) return IrPara();
  }, []);
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
        <Form className="row mt-3 mt-md-0" ref={formulario}>
          <div className="col-12 col-md-4 ">
            <Form.Label htmlFor="usuario">Nome Usuario</Form.Label>
            <InputGroup className="mb-3 ">
              <Button
                variant="warning"
                id="button-addon1"
                onClick={atualizarNombre}
              >
                Mudar
              </Button>
              <Form.Control
                id="usuario"
                placeholder={Usuario.Nombre}
                aria-label="Example text with button addon"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </div>
          <div className="col-12 col-md-4">
            <Form.Label htmlFor="senha">Mudar Senha</Form.Label>
            <InputGroup className="mb-3 ">
              <Button
                variant="warning"
                id="button-addon1"
                onClick={atualizarSenha}
              >
                Mudar
              </Button>
              <Form.Control
                id="senha"
                placeholder="**********"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </div>

          <div className="col-12 col-md-4">
            <Form.Label htmlFor="DataCreacion">Cuenta Creada:</Form.Label>
            <Form.Control
              id="DataCreacion"
              disabled
              placeholder={new Date(Usuario.DataCreacion).toLocaleString()}
              aria-describedby="basic-addon1"
            />
          </div>

          <div className="col-12  text-center">
            <h5 className="mt-2">Avatar</h5>
            <BoxImagenContainer>
              {Object.keys(Profiles).map((imageName, index) =>
                Usuario.FotoAvatar != imageName ? (
                  <div
                    key={"profile" + index}
                    className={selectedImages == imageName ? "Selecionado" : ""}
                    onClick={() => toggleImageSelection(imageName)}
                  >
                    <Image
                      className="rounded"
                      src={Profiles[imageName]}
                      width={70}
                      height={70}
                      alt={"profile" + index}
                    />
                  </div>
                ) : (
                  <></>
                )
              )}
            </BoxImagenContainer>
            <Button className="mt-3" onClick={atualizarAvatar}>
              Atualizar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
