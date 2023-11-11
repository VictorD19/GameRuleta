"use client";
import styled from "styled-components";
import "./style.css";
import Image from "next/image";
import Profile from "./face-1.png";
import Logo from "./logo.png";
import "./FuncoesAuxiliares";
import { Button } from "react-bootstrap";
import {
  FaHistory,
  FaMoneyBillWave,
  FaQuestionCircle,
  FaSignOutAlt,
  FaUserAstronaut,
} from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavComponent = styled.nav``;
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
export function Sidebar() {
  const pathname = usePathname();

  return (
    <NavComponent>
      <div className="sidebar-top">
        <span className="shrink-btn">
          <i className="bx bx-chevron-left"></i>
        </span>
        <Image src={Logo} width={50} height={50} />
        <h3 className="hide">Aqumex</h3>
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
            <Button variant="success" className="w-100">
              Depositar
            </Button>
          </div>
          <div className="col-6 px-2">
            <Button value="primary" className="w-100">
              Sacar
            </Button>
          </div>
        </div>
      </div>

      <div className="sidebar-links">
        <ul className="p-0">
          {MENUS.map((x, i) => (
            <li className={` tooltip-element  ${pathname.toLocaleLowerCase().includes(x.Titulo.toLocaleLowerCase()) ? "active-tab" : ""}`} data-tooltip="0" key={x.Titulo + i}>
              <Link href={x.Path} className="" data-active="0">
                <div className="icon ps-4">{x.Icon}</div>
                <span className="link hide">{x.Titulo}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </NavComponent>
  );
}
