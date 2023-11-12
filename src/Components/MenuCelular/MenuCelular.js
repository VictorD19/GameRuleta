import { FaBars } from "react-icons/fa";
import styled from "styled-components";
const MenuCelularCOmponente = styled.div`
 display: none;
  @media only screen and (max-width: 767px) {
    display: block;
  }


`;

export function MenuCelular({ toogle }) {
  return (
    <MenuCelularCOmponente className="w-100" >
      <div className="d-flex justify-content-end py-2 ps-4">
        <FaBars size={25} onClick={toogle} />
      </div>
    </MenuCelularCOmponente>
  );
}
