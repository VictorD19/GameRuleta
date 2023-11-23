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
import { LimparTudoLocalStorage, ObterItemLocalStorage } from "@/Api";
import { CriarAlerta, TIPO_ALERTA } from "@/Components/Alertas/Alertas";

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

  useEffect(() => {
    let dados = ObterItemLocalStorage("token");
    if (dados == null || !dados.data || !dados.access_token)
      return dispatch({ tipo: "CONECTADO", data: false });

    const dataAtual = new Date();
    const dataGeracaoToken = new Date(dados.data);
    const diferenciaEntreDatas = dataAtual - dataGeracaoToken;
    const horasDeDiferencia = Math.floor(
      (diferenciaEntreDatas % 86400000) / 3600000
    );

    if (!(horasDeDiferencia > 5)) {
      dispatch({ tipo: "CONECTADO", data: true });
      return;
    }

    LimparTudoLocalStorage();
    dispatch({ tipo: "CONECTADO", data: false });

    CriarAlerta(
      TIPO_ALERTA.SUCESSO,
      null,
      "Inicio de sessão realizado com sucesso"
    );
    return;
  }, []);

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
