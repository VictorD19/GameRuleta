"use client";
import styled from "styled-components";
import "./style.css";
import Image from "next/image";
import Logo from "../../Assert/logo.svg";
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
import { useDataContext } from "@/Context";

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
  const {
    appData: { Usuario },
  } = useDataContext();
  const [modalDeposito, setModalDeposito] = useState(false);
  const [modalSaque, setModalSaque] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const cerrarModalDeposito = () => setModalDeposito(false);
  const abrirModalDeposito = () => setModalDeposito(true);

  const cerrarModalSaque = () => setModalSaque(false);
  const abrirModalSaque = () => setModalSaque(true);

  const onSubmitSaque = (e) => {};
  const onSubmitDeposito = (e) => {};

  const itParaLaPagina = (pagina) => {
    router.push(`${pagina}`);
    toogle();
  };
  return (
    <>
      <NavComponent $visible={{ visible: visible == true ? true : false }}>
        <div className="sidebar-top d-flex justify-content-between">
          <div className="">
            <Image src={Logo} height={44} />
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
            <Image src={Usuario.FotoAvatar} width={50} height={50} />
            <div className="admin-info">
              <h3>{Usuario.Nombre}</h3>
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
            <h1>R$ {Usuario.Saldo}</h1>
          </div>
          <div className="row">
            <div className="col-6  px-2">
              <Button
                variant="success"
                className="w-100"
                onClick={abrirModalDeposito}
              >
                Recarga
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
        <form onSubmit={onSubmitDeposito}>
          <div>
            <label for="labelDeposito" className="mb-2">
              Digite o valor
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
              id="labelDeposito"
            />
          </div>
          <div className=" my-3">
            <label for="metodoPagamento">Método de Deposito</label>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="Pix"
              />
              <label className="form-check-label" for="Pix">
                Pix
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="CartaoCredito"
              />
              <label className="form-check-label" for="CartaoCredito" disabled>
                Cartão de Credito
              </label>
            </div>
          </div>

          <div className="my-3 d-flex justify-content-end">
            <Button type="submit" variant="success">
              Depositar
            </Button>
          </div>
        </form>
      </ModalComponent>

      <ModalComponent
        show={modalSaque}
        cerrarModal={cerrarModalSaque}
        titulo={"Saque"}
      >
        <form onSubmit={onSubmitSaque}>
          <div>
            <label for="valorSaque" className="mb-2">
              Valor do saque
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
              id="valorSaque"
            />
          </div>

          <div className="mt-3">
            <label for="chavePix" className="mb-2">
              Informe sua chave Pix
            </label>
            <input
              type="text"
              className="form-control"
              name="chavePix"
              id="chavePix"
            />
          </div>
          <p className=" mt-3" style={{ color: "#c1c1c1", fontSize: "0.8em" }}>
            Taxa de saque de 5%. Transferência do valor solicitado em até 24
            horas.
          </p>
          <div className="my-3 d-flex justify-content-end">
            <Button type="submit" variant="success">
              Sacar
            </Button>
          </div>
        </form>
      </ModalComponent>
    </>
  );
}
