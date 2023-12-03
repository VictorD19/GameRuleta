"use client";
import { MesaComponent } from "./mesa";
import { Jugadas } from "./jugadas";
import { useEffect } from "react";
import { useDataContext } from "@/Context";
import { useSearchParams } from "next/navigation";
import { useRedirectApp } from "@/Hooks/RoutesHooks";

export default function Page() {
  const { dispatch, atualizarUrlSala, webservice, loading } = useDataContext();
  const params = useSearchParams();
  const roomAtual = params.get("room");
  const { IrPara } = useRedirectApp();
  useEffect(() => {
    if (roomAtual) {
      if (roomAtual > 3 || roomAtual < 1) return IrPara("/");
      atualizarUrlSala(roomAtual);
    } else {
      atualizarUrlSala(0);
    }
  }, [roomAtual, webservice.readyState]);
  useEffect(() => {
    if (webservice.lastJsonMessage != null) {
      if (webservice.lastJsonMessage.estatusGeral != null)
        dispatch({
          tipo: "DATOS_GENERAL_SALA",
          data: webservice.lastJsonMessage.estatusGeral,
        });

      if (webservice.lastJsonMessage.statusMesas != null)
        dispatch({
          tipo: "SALA_ATUAL",
          data: webservice.lastJsonMessage.statusMesas,
        });
    }
  }, [webservice.lastJsonMessage, roomAtual]);
  return (
    <div className="">
      <MesaComponent />
      <Jugadas />
    </div>
  );
}
