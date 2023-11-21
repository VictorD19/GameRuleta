import ProfileDefaul from "../Assert/profile_defaul.png"
const LADO_A = "❤️";
const LADO_B = "🩵";
export const DataInicialApp = {
  Conectado: true,
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
    Saldo: 0.00,
    FotoAvatar: ProfileDefaul,
    Nombre: "Juansito",
    DataCreacion: "12/12/2023",
    HistoricoTransiones: [
      {
        id: 1,
        metodo: "Pix",
        valor: 100,
        data: "10/12/2023",
        entrada: true,
      },
      {
        id: 2,
        metodo: "Cartão",
        valor: 130,
        data: "10/12/2023",
        entrada: false,
      },
    ],
  },
  Partidas: [
    {
      id: 1,
      lado: LADO_A,
      valor: 100,
      porcentagem: 12,
      gano: true,
    },
    {
      id: 2,
      lado: LADO_B,
      valor: 150,
      porcentagem: 52,
      gano: true,
    },
    {
      id: 4,
      lado: LADO_A,
      valor: 130,
      porcentagem: 22,
      gano: false,
    },
  ],
  SalaAtual: {
    JugadoresA: [
      {
        imagem: ProfileDefaul,
        nombre: "nombre",
        valor: 12.33,
        porcentagem: 12,
      },
      {
        imagem: ProfileDefaul,
        nombre: "nombre",
        valor: 12.33,
        porcentagem: 12,
      },
      {
        imagem: ProfileDefaul,
        nombre: "nombre",
        valor: 12.33,
        porcentagem: 12,
      },
    ],
    JugadoresB: [
      {
        imagem: ProfileDefaul,
        nombre: "nombre",
        valor: 12.33,
        porcentagem: 12,
      },
      {
        imagem: ProfileDefaul,
        nombre: "nombre",
        valor: 12.33,
        porcentagem: 12,
      },
      {
        imagem: ProfileDefaul,
        nombre: "nombre",
        valor: 12.33,
        porcentagem: 12,
      },
    ],
    id: 1,
    TotalLadoA: 100,
    TotalLadoB: 140,
    PorcentagemA: 40,
    PorcentagemB: 60,
    TotalApostado: 100,
    RuletaActiva: true,
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
      salaAtual.JugadoresA = dadosSalaAtual.jugadoresLadoA
      salaAtual.JugadoresB = dadosSalaAtual.jugadoresLadob
      salaAtual.TotalLadoA = dadosSalaAtual.totalLadoA
      salaAtual.TotalLadoB = dadosSalaAtual.totalLadoB
      salaAtual.PorcentagemA = dadosSalaAtual.porcentagemLadoA
      salaAtual.PorcentagemB = dadosSalaAtual.porcentagemLadoB
      salaAtual.RuletaActiva = dadosSalaAtual.ruletaActiva
      salaAtual.TotalApostado = dadosSalaAtual.totalApostado
      salaAtual.HistoricoPartidas = dadosSalaAtual.historicoMesa
      return {
        ...state,SalaAtual: salaAtual
      }
    case "CONECTADO":
      return {
        ...state,Conectado: action.data
      }
    default:
      break;
  }

};