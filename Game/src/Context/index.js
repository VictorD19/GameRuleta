"use client";
const {
  createContext,
  useEffect,
  useReducer,
  useContext,
  useState,
  useCallback,
} = require("react");
const ContextoApp = createContext();
import { usePathname } from "next/navigation";
import { reducer, DataInicialApp } from "./reducerApp";
import useWebSocket from "react-use-websocket";
import {
  LimparTudoLocalStorage,
  ObterItemLocalStorage,
  executarREST,
} from "@/Api";
import { CriarAlerta, TIPO_ALERTA } from "@/Components/Alertas/Alertas";
import { useAuthHook } from "@/Hooks/AuthHook";

let URL = "ws://localhost:8000/mesas/status-mesas/";
let ReadyState = {
  UNINSTANTIATED: -1,
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};

export const ContextAppProvider = ({ children }) => {
  const [urlPadraoWs, setUrlWebSocket] = useState(URL + "0");
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    urlPadraoWs,
    {
      shouldReconnect: () => true,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
    }
  );

  const pathName = usePathname();
  const [appData, dispatch] = useReducer(reducer, DataInicialApp);
  const { SessionLoginActiva, ObterIdUsuariPorToken } = useAuthHook();
  useEffect(() => {
    if (!SessionLoginActiva()) {
      return dispatch({ tipo: "CONECTADO", data: false });
    }

    (async () => {
      let { error, ...data } = await executarREST(
        `user/get/${ObterIdUsuariPorToken()}`,
        "GET"
      );
      if (error != null) {
        LimparTudoLocalStorage();
        dispatch({ tipo: "CONECTADO", data: false });
        CriarAlerta(
          TIPO_ALERTA.ERROR,
          null,
          "Por favor inicie sessão novamente"
        );
        return;
      }

      const atualizarDados = {
        Id: data.id,
        Saldo: data.saldo,
        FotoAvatar: data.avatar,
        DataCreacion: data.dataCriacion,
        Nombre: data.username,
        Status: data.status,
      };

      dispatch({ tipo: "CONECTADO", data: true });
      dispatch({ tipo: "DADOS_USUARIO", data: atualizarDados });
    })();
  }, [appData.Conectado]);

  useEffect(() => {
    if (lastJsonMessage != null) {
      if (lastJsonMessage.estatusGeral != null)
        dispatch({
          tipo: "DATOS_GENERAL_SALA",
          data: lastJsonMessage.estatusGeral,
        });

      if (lastJsonMessage.statusMesas != null)
        dispatch({
          tipo: "SALA_ATUAL",
          data: lastJsonMessage.statusMesas,
        });
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    if (pathName.toLocaleLowerCase().includes("salas")) {
      setUrlWebSocket(ObterUrl(pathName));
    } else setUrlWebSocket(URL + "0");
  }, [pathName]);
  return (
    <ContextoApp.Provider value={{ appData, dispatch }}>
      {children}
    </ContextoApp.Provider>
  );
};

export const useDataContext = () => {
  const { appData, dispatch } = useContext(ContextoApp);
  return { appData, dispatch };
};

function ObterUrl(caminho) {
  if (!caminho.toLocaleLowerCase().includes("salas")) return urlPadrao + "0";

  let tempPath = caminho.replace("/", "");
  let sala = tempPath.includes("/")
    ? tempPath.charAt(tempPath.length - 1)
    : "1";

  return URL + sala;
}
