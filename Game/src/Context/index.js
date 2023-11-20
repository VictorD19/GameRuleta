const { createContext } = require("react");
const ContextoApp = createContext()


export const ContextAppProvider = async ({ children }) => {

    return (
        <ContextoApp.Provider value={{}}>
            {children}
        </ContextoApp.Provider>
    );
};

export const useDataContext = () => {
    const { dadosUsuario, dispatchUsuario } = useContext(ContextoApp);
    return { dadosUsuario, dispatchUsuario };
};