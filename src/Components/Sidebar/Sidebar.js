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

const NavComponent = styled.nav``;

export function Sidebar() {
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
        <ul>
          <div className="active-tab"></div>
          <li className="tooltip-element" data-tooltip="0">
            <a href="#" className="active" data-active="0">
              <div className="icon">
                <FaUserAstronaut />
              </div>
              <span className="link hide">CONTA</span>
            </a>
          </li>
          <li className="tooltip-element" data-tooltip="2">
            <a href="#" data-active="2">
              <div className="icon">
                <FaHistory />
              </div>
              <span className="link hide">PARTIDAS</span>
            </a>
          </li>
          <li className="tooltip-element" data-tooltip="1">
            <a href="#" data-active="1">
              <div className="icon">
                <FaQuestionCircle />
              </div>
              <span className="link hide">FAQ</span>
            </a>
          </li>

          <li className="tooltip-element" data-tooltip="3">
            <a href="#" data-active="3">
              <div className="icon">
                <i className="bx bx-bar-chart-square"></i>
                <FaSignOutAlt />
              </div>
              <span className="link hide">SAIR</span>
            </a>
          </li>
        </ul>
      </div>
    </NavComponent>
  );
}
