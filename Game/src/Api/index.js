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
const URL_PADRAO = "http://localhost:8000/";

const executarREST = async (url, tipoConsulta = "GET", data = null) => {
  try {
    debugger;
    const consulta = await fetch(URL_PADRAO + url, {
      method: tipoConsulta,
      body: data != null ? JSON.stringify(data) : null,
      headers: {
        "Content-Type": "application/json",
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


const ObterItemLocalStorage = (key = "")=>{
  const data = localStorage.getItem(key);
  return JSON.parse(data)
}

const InserirRegistroLocalStorage = (key= "",data= {})=>{
  localStorage.setItem(key, JSON.stringify(data));
}

const RemoverItemLocalStorage = (key)=>{
  localStorage.removeItem(key);
}
const LimparTudoLocalStorage = ()=>{
  localStorage.clear();
}

export { executarREST, ObterItemLocalStorage,InserirRegistroLocalStorage,RemoverItemLocalStorage,LimparTudoLocalStorage};
