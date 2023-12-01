"use client";
import styled from "styled-components";
import "./style.css";
import Image from "next/image";
import Logo from "../../Assert/logo.svg";
import Defaul from "../../Assert/Profile/profile_1.webp";
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";
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
import { useEffect, useState } from "react";
import { useDataContext } from "@/Context";
import { CardLogin } from "./cardLogin";
import { LimparTudoLocalStorage } from "@/Api";
import Profiles from "../../Assert/Profile";
import { ModalSaque } from "./Saque";
import { DepositoModal } from "./Deposito";
const NavComponent = styled.nav`
  display: none;

  @media only screen and (max-width: 863px) {
    position: fixed;
    z-index: 999;
    transition: 0.5s all ease;
    display: ${(prop) => (prop.$visible.visible ? "block" : "none")};
    width: 100%;
    height: 100vh;
    height: 100dvh;

    .botonClose {
      display: block;
    }
    .permiteRolar {
      overflow: hidden;
    }
  }

  /* Media query para notebooks e PCs (a partir de 768px) */
  @media only screen and (min-width: 768px) {
    display: block;
    height: 100vh;
    height: 100dvh;
    margin-left: -10px;
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
];

export function Sidebar({
  naoMostrarSidebar,
  MostrarSidebar,
  visible = false,
  toogle,
}) {
  const { appData, dispatch } = useDataContext();
  const { Usuario } = appData;
  const [modalDeposito, setModalDeposito] = useState(false);
  const [modalSaque, setModalSaque] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const sairDoSistema = () => {
    LimparTudoLocalStorage();
    dispatch({ tipo: "CONECTADO", data: false });
    router.push(`/Salas?room=1`);
  };

  const cerrarModalDeposito = () => setModalDeposito(false);
  const abrirModalDeposito = () => setModalDeposito(true);

  const cerrarModalSaque = () => setModalSaque(false);
  const abrirModalSaque = () => setModalSaque(true);

  const onSubmitSaque = (e) => {};

  const itParaLaPagina = (pagina) => {
    router.push(`${pagina}`);
    toogle();
  };

  return (
    <>
      <NavComponent $visible={{ visible: visible == true ? true : false }}>
        <div className="sidebar-top d-flex justify-content-between">
          <div className="">
            <Image src={Logo} height={44} alt="logo" />
          </div>

          <Button
            variant="default"
            className="text-white botonClose"
            onClick={toogle}
          >
            X
          </Button>
        </div>
        {appData.Conectado ? (
          <>
            <div className="tooltip-element mt-4 mb-2" data-tooltip="1">
              <div className="admin-profile hide gap-2">
                <Image
                  src={Profiles[Usuario.FotoAvatar]}
                  width={80}
                  height={80}
                  alt="fotoPerfil"
                  style={{ borderRadius: "10%" }}
                />
                <div className="admin-info ml-3">
                  <h3 className="m-0">{Usuario.Nombre}</h3>
                  <small style={{ color: "#c1c1c1" }}>#{Usuario.Id}</small>
                </div>
              </div>
            </div>
            <div className="my-3 ">
              <div className="">
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
                <li
                  className={` tooltip-element  ${
                    pathname.toLocaleLowerCase().includes("SAIR")
                      ? "active-tab"
                      : ""
                  }`}
                  data-tooltip="0"
                  key={"OpcaoSair_"}
                >
                  <div onClick={sairDoSistema} data-active="0">
                    <div className="icon ps-4">
                      <FaSignOutAlt />
                    </div>
                    <span className="link hide">SAIR</span>
                  </div>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <CardLogin toogle={toogle}/>
        )}
      </NavComponent>
      <ModalSaque show={modalSaque} close={cerrarModalSaque} />
      <DepositoModal
        modalDeposito={modalDeposito}
        cerrarModalDeposito={cerrarModalDeposito}
      />
    </>
  );
}
