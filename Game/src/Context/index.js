"use client";
const { createContext, useEffect, useReducer, useContext } = require("react");
const ContextoApp = createContext();
import { socket } from "../Api";
import { reducer, DataInicialApp } from "./reducerApp";
export const ContextAppProvider = ({ children }) => {
  const [appData, dispatch] = useReducer(reducer, DataInicialApp);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
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
