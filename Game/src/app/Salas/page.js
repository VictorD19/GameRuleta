"use client";
import { MesaComponent } from "./mesa";
import { Jugadas } from "./jugadas";
import { useEffect } from "react";
import { useDataContext } from "@/Context";
import { useSearchParams } from "next/navigation";
import { useRedirectApp } from "@/Hooks/RoutesHooks";

export default function Page() {
  const { dispatch, atualizarUrlSala } = useDataContext();
  const params = useSearchParams();
  const roomAtual = params.get("room");
  const { IrPara } = useRedirectApp();
  useEffect(() => {
    if (roomAtual) {
      if (roomAtual > 3 || roomAtual < 1) return IrPara("/");
      atualizarUrlSala(roomAtual);
    } else {
      atualizarUrlSala();
    }
  }, [roomAtual]);
  return (
    <div className="">
      <MesaComponent />
      <Jugadas />
    </div>
  );
}
