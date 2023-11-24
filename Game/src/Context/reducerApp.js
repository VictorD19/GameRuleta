import ProfileDefaul from "../Assert/profile_defaul.png"
import Profiles from "../Assert/Profile"

export const DataInicialApp = {
  Conectado: false,
  SalasGerais: [
    {
      numero: 1,
      minimo: 1,
      maximo: 200,
      jugadores: 0,
      totalApostado: 0,
    },
    {
      numero: 2,
      minimo: 10,
      maximo: 500,
      jugadores: 0,
      totalApostado: 0,
    },
    {
      numero: 3,
      minimo: 100,
      maximo: 10000,
      jugadores: 0,
      totalApostado: 0,
    },
  ],
  Usuario: {
    Id: 0,
    Saldo: 0.00,
    FotoAvatar: Profiles["Profile1"],
    Nombre: "",
    DataCreacion: "",
    HistoricoTransiones: [
      // {
      //   id: 1,
      //   metodo: "Pix",
      //   valor: 100,
      //   data: "10/12/2023",
      //   entrada: true,
      // },
    ],
  },
  Partidas: [
    {
      id: 1,
      lado: "",
      valor: 100,
      porcentagem: 12,
      gano: true,
    },
    {
      id: 2,
      lado: "",
      valor: 150,
      porcentagem: 52,
      gano: true,
    },
    {
      id: 4,
      lado: "",
      valor: 130,
      porcentagem: 22,
      gano: false,
    },
  ],
  SalaAtual: {
    JugadoresA: [],
    JugadoresB: [],
    id: 1,
    TotalLadoA: 100,
    TotalLadoB: 140,
    PorcentagemA: 40,
    PorcentagemB: 60,
    TotalApostado: 100,
    RuletaActiva: true,
    RuletaGenerada: [],
    PosicaoSelecionada: 1,
    IndiceGanador: 0,
    HistoricoPartidas: [
      {
        id: 1,
        Ganador: 1, //lado
        Jugadores: 3,
        Total: 100,
      },
      {
        id: 2,
        Ganador: 2, //lado
        Jugadores: 7,
        Total: 140,
      },
      {
        id: 3,
        Ganador: 1, //lado
        Jugadores: 3,
        Total: 100,
      },
      {
        id: 4,
        Ganador: 2, //lado
        Jugadores: 6,
        Total: 100,
      },
      {
        id: 5,
        Ganador: 2, //lado
        Jugadores: 13,
        Total: 10,
      },
    ],
  },
};

export const reducer = (state, action) => {
  switch (action.tipo) {
    case "DATOS_GENERAL_SALA":
      return {
        ...state, SalasGerais: action.data
      };
    case "SALA_ATUAL":

      let salaAtual = state.SalaAtual
      let dadosSalaAtual = action.data
      salaAtual.id = dadosSalaAtual.idMesa
      salaAtual.JugadoresA = dadosSalaAtual.jugadoresLadoA.sort((a, b) => b.porcentagem - a.porcentagem)
      salaAtual.JugadoresB = dadosSalaAtual.jugadoresLadoB.sort((a, b) => b.porcentagem - a.porcentagem)
      salaAtual.TotalLadoA = dadosSalaAtual.totalLadoA
      salaAtual.TotalLadoB = dadosSalaAtual.totalLadoB
      salaAtual.PorcentagemA = dadosSalaAtual.porcentagemLadoA
      salaAtual.PorcentagemB = dadosSalaAtual.porcentagemLadoB
      salaAtual.RuletaActiva = dadosSalaAtual.ruletaActiva
      salaAtual.TotalApostado = dadosSalaAtual.totalApostado
      salaAtual.HistoricoPartidas = dadosSalaAtual.historicoMesa
      return {
        ...state, SalaAtual: salaAtual
      }
    case "CONECTADO":
      return {
        ...state, Conectado: action.data
      }
    case "DADOS_USUARIO":
      return {
        ...state, Usuario: { ...state.Usuario, ...action.data }
      }
    default:
      break;
  }

};