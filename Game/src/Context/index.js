"use client";
const { createContext, useEffect, useReducer, useContext } = require("react");
const ContextoApp = createContext();
// import { socket } from "../Api";
import { reducer, DataInicialApp } from "./reducerApp";
let webSocket = new WebSocket("ws://localhost:8000/mesas/status-mesas/0")
export const ContextAppProvider = ({ children }) => {
  const [appData, dispatch] = useReducer(reducer, DataInicialApp);

  useEffect(() => {
    //   function onConnect() {
    //     setIsConnected(true);
    //   }

    //   function onDisconnect() {
    //     setIsConnected(false);
    //   }


    webSocket.onmessage = (event) => {
      let { estatusGeral, statusMesas } = JSON.parse(event.data)
      console.log(estatusGeral)
      dispatch({ tipo: "DATOS_GENERAL_SALA", data: estatusGeral })

      if (statusMesas != null)
        dispatch({ tipo: "SALA_ATUAL", data: statusMesas })
    }

    // socket.on("connect", onConnect);
    // socket.on("disconnect", onDisconnect);

    return () => {
      // socket.off("connect", onConnect);
      // socket.off("disconnect", onDisconnect);

    };
  }, []);

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
