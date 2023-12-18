"use client";
import { useEffect } from "react";

export const BackRedirect = () => {
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const message = "Você tem certeza que deseja sair do site?";
      e.returnValue = message; // Padrão para navegadores mais antigos
      return message; // Padrão para navegadores mais recentes
    };

    const handleUnload = () => {
      // Realize aqui as ações necessárias antes de sair, como salvar dados
      alert("Você está saindo do site. Realizando ações antes de sair...");
      // Redirecionamento para a URL desejada
      window.location.href = "http://localhost:3000/Salas?room=2";
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
