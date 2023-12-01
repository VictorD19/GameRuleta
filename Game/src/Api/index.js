import { io } from "socket.io-client";

// const socket = io("ws://localhost:8001", {
//     // auth: {
//     //     token: ObterToken(),
//     // },
//     autoConnect: true,
//     path: "/ws/socket.io/",
//     transports: ['websocket', 'polling']
// });

const socket = null;
export { socket };
export const URL_PADRAO = "http://localhost:8000/";
export const URL_PADRAO_SOCKET = "ws://localhost:8000";

const executarREST = async (url, tipoConsulta = "GET", data = null) => {
  try {
    const consulta = await fetch(URL_PADRAO + url, {
      method: tipoConsulta,
      body: data != null ? JSON.stringify(data) : null,
      headers: {
        "Content-Type": "application/json",
        Authorization:
          ObterTokenAuth() != null ? "Bearer " + ObterTokenAuth() : "",
      },
    });
    const retorno = await consulta.json();
    if (consulta.status < 200 || consulta.status > 299)
      return {
        error: retorno.detail,
      };

    return retorno;
  } catch (error) {
    return {
      error: "Ocorreu uma falha ao tentar conectar",
    };
  }
};

const ObterItemLocalStorage = (key = "") => {
  if (typeof window === "undefined") return "";

  const data = localStorage.getItem(key);

  return data != null ? JSON.parse(data) : "";
};

const InserirRegistroLocalStorage = (key = "", data = {}) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

const RemoverItemLocalStorage = (key) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};
const LimparTudoLocalStorage = () => {
  if (typeof window !== "undefined") localStorage.clear();
};
const ObterTokenAuth = () => {
  let { access_token } = ObterItemLocalStorage("token");
  return access_token;
};

export {
  executarREST,
  ObterItemLocalStorage,
  InserirRegistroLocalStorage,
  RemoverItemLocalStorage,
  LimparTudoLocalStorage,
};
