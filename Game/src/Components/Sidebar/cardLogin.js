"use client";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { LoginModal, RegistroModal } from "../LoginRegistro";
import styled from "styled-components";

const CardLoginComponet = styled.div`
  padding: 2rem 0.5rem;
  gap: 1rem;
  button {
    font-weight: 700;
    letter-spacing: 0.1rem;
  }
`;

export const CardLogin = () => {
  const [modalRegistroVisibilidade, setVisibilidadeModalRegistro] =
    useState(false);
  const [modalLoginVisibilidade, setVisibilidadeModalLogin] = useState(false);

  const cerrarModalLogin = () => setVisibilidadeModalLogin(false);
  const abrirModalLogin = () => setVisibilidadeModalLogin(true);

  const cerrarModalRegistro = () => setVisibilidadeModalRegistro(false);
  const abrirModalRegistro = () => setVisibilidadeModalRegistro(true);
  return (
    <>
      <CardLoginComponet className="row ">
        <Button
          onClick={abrirModalLogin}
          className="w-100 text-uppercase"
          variant="success"
        >
          Entrar
        </Button>
        <Button onClick={abrirModalRegistro} className="w-100 text-uppercase">
          Criar Conta
        </Button>
        <hr />
        <p className="text-center" style={{ fontSize: "0.8em", color:"#c1c1c1"}}>
          Desenvolvido com muito carinho ❤️
          <b />
          Joge com moderação
        </p>
      </CardLoginComponet>
      <LoginModal
        cerrarModal={cerrarModalLogin}
        show={modalLoginVisibilidade}
      />
      <RegistroModal
        cerrarModal={cerrarModalRegistro}
        show={modalRegistroVisibilidade}
      />
    </>
  );
};
