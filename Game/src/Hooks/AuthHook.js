import { LimparTudoLocalStorage, ObterItemLocalStorage } from "@/Api";
import { jwtDecode } from "jwt-decode";
export const useAuthHook = () => {
  const data = ObterItemLocalStorage("token");

  const SessionLoginActiva = () => {
    if (data == null) return false;

    if (data.access_token == null) {
      LimparTudoLocalStorage();
      return false;
    }

    const dataAtual = new Date();
    const dataGeracaoToken = new Date(data.data);
    const diferenciaEntreDatas = dataAtual - dataGeracaoToken;
    const horasDeDiferencia = Math.floor(
      (diferenciaEntreDatas % 86400000) / 3600000
    );

    if (horasDeDiferencia > 5) {
      LimparTudoLocalStorage();
      return false;
    }

    return true;
  };

  return {
    SessionLoginActiva,
    ObterIdUsuariPorToken: (token = null) => {
      if (!SessionLoginActiva() && token == null) return 0;
      token = token != null ? token : data.access_token;
      const { id } = jwtDecode(token);
      return id;
    },
  };
};
