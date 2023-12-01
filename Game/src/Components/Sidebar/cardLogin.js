"use client";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { LoginModal, RegistroModal } from "../LoginRegistro";
import styled from "styled-components";
import { useRedirectApp } from "@/Hooks/RoutesHooks";
import { FaQuestionCircle } from "react-icons/fa";
import { useDataContext } from "@/Context";

const CardLoginComponet = styled.div`
  padding: 2rem 0.5rem;
  gap: 1rem;
  button {
    font-weight: 700;
    letter-spacing: 0.1rem;
  }
`;
export const CardLogin = ({toogle}) => {
  const { modalLoginVisibilidade, modalRegistroVisibilidade, loginsMethod } =
    useDataContext();
  const { IrPara } = useRedirectApp();
  return (
    <>
      <CardLoginComponet className="row ">
        <Button
          onClick={loginsMethod.abrirModalLogin}
          className="w-100 text-uppercase"
          variant="success"
        >
          Entrar
        </Button>
        <Button
          onClick={loginsMethod.abrirModalRegistro}
          className="w-100 text-uppercase"
        >
          Criar Conta
        </Button>
        <hr />

        <div
          onClick={() => {
            IrPara("/Faq")
            toogle()
          }}
          className="d-flex"
          data-active="0"
          style={{ fontSize: "0.8em", cursor: "pointer" }}
        >
          <div className="icon ps-4">
            <FaQuestionCircle />
          </div>
          <span className="link hide">Preguntas Frecuentes</span>
        </div>
        <p
          className="text-center"
          style={{ fontSize: "0.8em", color: "#c1c1c1" }}
        >
          Desenvolvido com muito carinho ❤️
          <b />
          Jogue com moderação
        </p>
      </CardLoginComponet>
      <LoginModal
        cerrarModal={loginsMethod.cerrarModalLogin}
        show={modalLoginVisibilidade}
      />
      <RegistroModal
        cerrarModal={loginsMethod.cerrarModalRegistro}
        show={modalRegistroVisibilidade}
      />
    </>
  );
};
