"use client";
import styled from "styled-components";
import "./style.css";
import Image from "next/image";
import Profile from "./face-1.png";
import Logo from "./logo.png";
import "./FuncoesAuxiliares";
import { Button } from "react-bootstrap";
import {
  FaBars,
  FaHistory,
  FaMoneyBillWave,
  FaQuestionCircle,
  FaSignOutAlt,
  FaUserAstronaut,
} from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { ModalComponent } from "../Modal/Modal";
import { useState } from "react";

const NavComponent = styled.nav`
  @media only screen and (max-width: 767px) {
    position: absolute;
    z-index: 2;
    transition: 0.5s all ease;
    display: ${(prop) => (prop.$visible.visible ? "block" : "none")};
    width: 100%;

    .botonClose {
      display: block;
    }
  }

  /* Media query para notebooks e PCs (a partir de 768px) */
  @media only screen and (min-width: 768px) {
    display: block;
    height: 100vh;
    .botonClose {
      display: none;
    }
  }
`;
const MENUS = [
  {
    Titulo: "CONTA",
    Icon: <FaUserAstronaut />,
    Path: "/Conta",
  },
  {
    Titulo: "PARTIDAS",
    Icon: <FaHistory />,
    Path: "/Partidas",
  },
  {
    Titulo: "FAQ",
    Icon: <FaQuestionCircle />,
    Path: "/Faq",
  },
  {
    Titulo: "SAIR",
    Icon: <FaSignOutAlt />,
    Path: "/Logout",
  },
];
export function Sidebar({ visible = false, toogle }) {
  const [modalDeposito, setModalDeposito] = useState(false);
  const [modalSaque, setModalSaque] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const cerrarModalDeposito = () => setModalDeposito(false);
  const abrirModalDeposito = () => setModalDeposito(true);

  const cerrarModalSaque = () => setModalSaque(false);
  const abrirModalSaque = () => setModalSaque(true);

  const itParaLaPagina = (pagina) => {
    router.push(`${pagina}`);
    toogle();
  };
  return (
    <>
      <NavComponent $visible={{ visible: visible == true ? true : false }}>
        <div className="sidebar-top d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <span className="shrink-btn">
              <i className="bx bx-chevron-left"></i>
            </span>
            <Image src={Logo} width={50} height={50} />
            <h3 className="hide">Aqumex</h3>
          </div>

          <Button
            variant="default"
            className="text-white botonClose"
            onClick={toogle}
          >
            X
          </Button>
        </div>
        <div className="admin-user tooltip-element mt-4 mb-2" data-tooltip="1">
          <div className="admin-profile hide">
            <Image src={Profile} width={50} height={50} />
            <div className="admin-info">
              <h3>John Doe</h3>
              <h5>Admin</h5>
            </div>
          </div>
        </div>
        <div className="my-3">
          <div>
            <span>
              <b>
                <FaMoneyBillWave /> Conta{" "}
              </b>
            </span>
            <h1>R$ 100,00</h1>
          </div>
          <div className="row">
            <div className="col-6  px-2">
              <Button
                variant="success"
                className="w-100"
                onClick={abrirModalDeposito}
              >
                Depositar
              </Button>
            </div>
            <div className="col-6 px-2">
              <Button
                value="primary"
                className="w-100"
                onClick={abrirModalSaque}
              >
                Sacar
              </Button>
            </div>
          </div>
        </div>

        <div className="sidebar-links">
          <ul className="p-0">
            {MENUS.map((x, i) => (
              <li
                className={` tooltip-element  ${
                  pathname
                    .toLocaleLowerCase()
                    .includes(x.Titulo.toLocaleLowerCase())
                    ? "active-tab"
                    : ""
                }`}
                data-tooltip="0"
                key={x.Titulo + i}
              >
                <div
                  onClick={() => itParaLaPagina(x.Path)}
                  className=""
                  data-active="0"
                >
                  <div className="icon ps-4">{x.Icon}</div>
                  <span className="link hide">{x.Titulo}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </NavComponent>
      <ModalComponent
        show={modalDeposito}
        cerrarModal={cerrarModalDeposito}
        titulo={"Deposito"}
      >
        FormularioDeposito
      </ModalComponent>

      <ModalComponent show={modalSaque} cerrarModal={cerrarModalSaque} titulo={"Saque"}>
        Formulario Deposito
      </ModalComponent>
    </>
  );
}
