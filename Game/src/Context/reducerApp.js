import ProfileDefaul from "../Assert/profile_defaul.png";
import Profiles from "../Assert/Profile";

export const DataInicialApp = {
  Conectado: false,
  SalasGerais: [
    {
      numero: 1,
      minimo: 1,
      maximo: 1000,
      jugadores: 0,
      SegundosRestantes: 0,
      totalApostado: 0,
    },
    {
      numero: 2,
      minimo: 20,
      maximo: 5000,
      jugadores: 0,
      SegundosRestantes: 0,
      totalApostado: 0,
    },
    {
      numero: 3,
      minimo: 100,
      maximo: 10000,
      jugadores: 0,
      SegundosRestantes: 0,
      totalApostado: 0,
    },
  ],
  Usuario: {
    Id: 0,
    Saldo: 0.0,
    FotoAvatar: Profiles["Profile1"],
    Nombre: "",
    DataCreacion: "",
    HistoricoTransiones: [],
  },
  Partidas: [],
  SalaAtual: {
    JugadoresA: [],
    JugadoresB: [],
    id: 1,
    TotalLadoA: 0,
    TotalLadoB: 0,
    StatusMesa: false,
    PorcentagemA: 100,
    PorcentagemB: 100,
    TotalApostado: 0,
    IndiceGanador: 0,
    LadoGanador: 0,
    UltimaNotificacaoFinJogada: "",
    SegundosRestantes: 30,
    HistoricoPartidas: [],
    RuletaGenerada: [],
  },
};

export const reducer = (state, action) => {
  switch (action.tipo) {
    case "DATOS_GENERAL_SALA":
      return {
        ...state,
        SalasGerais: action.data,
      };
    case "SALA_ATUAL":
      let salaAtual = state.SalaAtual;
      let dadosSalaAtual = action.data;
      salaAtual.id = dadosSalaAtual.idMesa;
      salaAtual.JugadoresA = dadosSalaAtual.jugadoresLadoA.sort(
        (a, b) => b.porcentagem - a.porcentagem
      );
      salaAtual.JugadoresB = dadosSalaAtual.jugadoresLadoB.sort(
        (a, b) => b.porcentagem - a.porcentagem
      );
      salaAtual.TotalLadoA = dadosSalaAtual.totalLadoA;
      salaAtual.TotalLadoB = dadosSalaAtual.totalLadoB;
      salaAtual.PorcentagemA = dadosSalaAtual.porcentagemLadoA;
      salaAtual.PorcentagemB = dadosSalaAtual.porcentagemLadoB;
      salaAtual.RuletaActiva = dadosSalaAtual.ruletaActiva;
      salaAtual.TotalApostado = dadosSalaAtual.totalApostado;
      salaAtual.HistoricoPartidas = dadosSalaAtual.historicoMesa;
      salaAtual.SegundosRestantes = dadosSalaAtual.SegundoRestantes;
      salaAtual.RuletaGenerada = JSON.parse(dadosSalaAtual.ultimaruletaGenerada);
      salaAtual.IndiceGanador = dadosSalaAtual.ultimoIndiceGanador;
      salaAtual.LadoGanador = dadosSalaAtual.ultimoLadoGanador;
      salaAtual.UltimaNotificacaoFinJogada = dadosSalaAtual.ultimaDataRuletaGenerada;
      return {
        ...state,
        SalaAtual: salaAtual,
      };
    case "CONECTADO":
      return {
        ...state,
        Conectado: action.data,
      };
    case "DADOS_USUARIO":
      return {
        ...state,
        Usuario: { ...state.Usuario, ...action.data },
      };
    default:
      break;
  }
};
