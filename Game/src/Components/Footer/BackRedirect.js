"use client";
import { useEffect } from "react";

export const BackRedirect = () => {
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const message = "Você tem certeza que deseja sair do site?";
      e.returnValue = message; 
      return message; 
    };

    const handleUnload = () => {
      window.location.href = "https://funcombat.online/Salas?room=1";
      //Criar pop pup bonus

    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);
  return null;
};
