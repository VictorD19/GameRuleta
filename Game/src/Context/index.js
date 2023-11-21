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

let URL = "ws://localhost:8000/mesas/status-mesas/";
let ReadyState = {
  UNINSTANTIATED: -1,
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};

export const ContextAppProvider = ({ children }) => {
  const funcoesWebsocket = useCallback(() => {
    ((event) => {
      let { estatusGeral, statusMesas } = JSON.parse(event.data);
      d;

      if (statusMesas != null)
        dispatch({ tipo: "SALA_ATUAL", data: statusMesas });
    })();
  }, []);

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

  console.log(lastJsonMessage);
  // dispatch({ tipo: "CONECTADO", data: true });
  // dispatch({ tipo: "CONECTADO", data: false });

  useEffect(() => {
    if (lastJsonMessage != null) {
      if (lastJsonMessage.estatusGeral != null)
        dispatch({
          tipo: "DATOS_GENERAL_SALA",
          data: lastJsonMessage.estatusGeral,
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
