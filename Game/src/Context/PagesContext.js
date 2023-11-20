'use client'

import { usePathname } from "next/navigation";

const { createContext, useState, useEffect } = require("react");
const ContextPageApp = createContext()

const DATA_DEFAUL_PAGE = {
    idMesa: 0,
    jugadoresLadoA: [],
    JugadoresLadoB: [],
    TotalLadoA: 0,
    TotalLadoB: 0,
    TotalApostado: 0,
    HistoricoMesa: [],
    PorcentagemLadoA: 0,
}

const ULR_SOCKES = {
    "salas": '/mesas/1',
    "salas2": '/mesas/2',
    "salas3": '/mesas/3',
}
export const ContextAppProvider = async ({ children }) => {
    const [dataPaginaAtual, setDataPagina] = useState(DATA_DEFAUL_PAGE)
    let webSoketsala = null
    const pathName = usePathname()
    useEffect(() => {
        if (pathName.toLocaleLowerCase().includes("salas")) {
            if (webSoketsala != null && webSoketsala.readyState == 1)
                webSoketsala.close();
            let tempCaminho = pathName.replace("/", "")
            let caminhoUrl = tempCaminho.includes("/") ? tempCaminho.split("/")[1] : tempCaminho

            webSoketsala = new WebSocket(`ws://localhost:8000/${ULR_SOCKES[caminhoUrl]}`)
            webSoketsala.onmessage = (ev) => {
                let dataConvertida = JSON.parse(ev.data)
                setDataPagina(dataConvertida)
            }

        } else {
            if (webSoketsala != null)
                webSoketsala.close()
        }

        // return () => {
        //     if (webSoketsala != null)
        //         webSoketsala.close()
        // }
    }, [pathName])

    const closeWebSocketSala = () => {
        if (webSoketsala == null || (webSoketsala.readyState == 2 || webSoketsala.readyState == 3))
            return;

        webSoketsala.close()
    }
    return (
        <ContextPageApp.Provider value={{ dataPaginaAtual, closeWebSocketSala }}>
            {children}
        </ContextPageApp.Provider>
    );
};

export const usePaginaWebsocket = () => {
    const { dataPaginaAtual, closeWebSocketSala } = useContext(ContextPageApp);
    return { dataPaginaAtual, closeWebSocketSala };
};