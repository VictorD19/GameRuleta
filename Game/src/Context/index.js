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
  URL_PADRAO_SOCKET,
  executarREST,
} from "@/Api";
import { CriarAlerta, TIPO_ALERTA } from "@/Components/Alertas/Alertas";
import { useAuthHook } from "@/Hooks/AuthHook";

let ReadyState = {
  UNINSTANTIATED: -1,
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};

export const ContextAppProvider = ({ children }) => {
  const [urlPadraoWs, setUrlWebSocket] = useState(
    URL_PADRAO_SOCKET + "/mesas/status-mesas/0"
  );
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
  const [modalRegistroVisibilidade, setVisibilidadeModalRegistro] =
    useState(false);
  const [modalLoginVisibilidade, setVisibilidadeModalLogin] = useState(false);

  const cerrarModalLogin = () => setVisibilidadeModalLogin(false);
  const abrirModalLogin = () => setVisibilidadeModalLogin(true);

  const cerrarModalRegistro = () => setVisibilidadeModalRegistro(false);
  const abrirModalRegistro = () => setVisibilidadeModalRegistro(true);

  const loginsMethod = {
    cerrarModalRegistro,
    abrirModalRegistro,
    cerrarModalLogin,
    abrirModalLogin,
  };
  const { SessionLoginActiva, ObterIdUsuariPorToken } = useAuthHook();

  const atualizarUrlSala = (sala = 0) =>
    setUrlWebSocket(URL_PADRAO_SOCKET + "/mesas/status-mesas/" + sala);

  useEffect(() => {
    if (!SessionLoginActiva()) {
      return dispatch({ tipo: "CONECTADO", data: false });
    }
    if (appData.Usuario.Id > 0)
      return dispatch({ tipo: "CONECTADO", data: true });

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
    if (pathName.toLocaleLowerCase().includes("salas")) {
      setUrlWebSocket(ObterUrl(pathName));
    } else setUrlWebSocket(URL + "0");
  }, [pathName]);
  return (
    <ContextoApp.Provider value={{ appData, dispatch,webservice: {lastJsonMessage, readyState }, atualizarUrlSala,modalRegistroVisibilidade,modalLoginVisibilidade,loginsMethod}}>
      {children}
    </ContextoApp.Provider>
  );
};

export const useDataContext = () => {
  const { appData, atualizarUrlSala,webservice, dispatch,modalRegistroVisibilidade,modalLoginVisibilidade,loginsMethod } = useContext(ContextoApp);
  return { appData, atualizarUrlSala, webservice,dispatch,modalRegistroVisibilidade,modalLoginVisibilidade,loginsMethod };
};

function ObterUrl(caminho) {
  if (!caminho.toLocaleLowerCase().includes("salas")) return urlPadrao + "0";

  let tempPath = caminho.replace("/", "");
  let sala = tempPath.includes("/")
    ? tempPath.charAt(tempPath.length - 1)
    : "1";

  return URL + sala;
}
