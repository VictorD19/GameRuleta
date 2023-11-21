import Image from "next/image";
import { FaBars } from "react-icons/fa";
import styled from "styled-components";
import Logo from '../../Assert/logo.svg'
const MenuCelularCOmponente = styled.div`
 display: none;
  @media only screen and (max-width: 767px) {
    display: block;
  }


`;

export function MenuCelular({ toogle }) {
  return (
    <MenuCelularCOmponente className="w-100" >
      <div className="d-flex justify-content-between align-items-center py-2 ps-4">
        <Image src={Logo}  height={45} alt="logo"/>
        <FaBars size={25} onClick={toogle} />
      </div>
    </MenuCelularCOmponente>
  );
}
