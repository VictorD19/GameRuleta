"use client";
import { useState } from "react";
import { MenuCelular } from "../MenuCelular/MenuCelular";
import { Sidebar } from "../Sidebar/Sidebar";

export function Menu() {
  const [visibilidadeMenu, setVisibilidade] = useState(false);

  const toggleMenu = () => {
    setVisibilidade((atual) => !atual);
  };
  return (
    <>
      <MenuCelular toogle={toggleMenu} />
      <Sidebar visible={visibilidadeMenu} toogle={toggleMenu}/>
    </>
  );
}
