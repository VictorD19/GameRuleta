let mesa = {
  jugadores: [],
  total: 0.0,
  totalLadoA: 0.0,
  totalLadoB: 0.0,
  porcentagemA: 0,
  porcentagemB: 0,
};
const LADO_A = "❤️";
const LADO_B = "🩵";
const PORCENTAGEM_PADRAO = 100;
const RULETA = [];
//Los lado seran definidos por 0 e 1 siendo 0(Azul) 🩵 ❤️ e 1(rojo)

//Calcula valor a pagar ao jogador por porcentagem correspondete
function CalcularValorPagarPorPorcentagem(porcentagem = 0.0, valorTotal = 0.0) {
  let resultadoMultiplicacao = porcentagem * valorTotal;
  let valorPagar = resultadoMultiplicacao / 100;
  return valorPagar.toFixed(2);
}

//Calcula a % correspondente ao jogador deacordo a valor inserido por ele
function CalcularPorcentagemAReceberPorValor(
  valorInserido = 0.0,
  valorTotal = 0.0
) {
  let porcentagem = (valorInserido * 100) / valorTotal;
  return porcentagem.toFixed(2);
}

function PagarJogadores(ladoGanador) {
  let jugadoresParaPagar = mesa.jugadores.filter((x) => x.lado == ladoGanador);
  let totalPagar = mesa.total;

  for (let i = 0; i < jugadoresParaPagar.length; i++) {
    let jugador = jugadoresParaPagar[i];
    if (i == jugadoresParaPagar.length - 1) {
      console.log(
        `Foi realidado un pago al jugador: ${
          jugador.nome
        } no valor de: ${totalPagar.toFixed(2)}💵`
      );
      continue;
    }
    const valorPagar = CalcularValorPagarPorPorcentagem(
      jugador.porcentagem,
      totalPagar
    );
    totalPagar -= valorPagar;
    console.log(
      `Foi realidado un pago al jugador: ${jugador.nome} no valor de: ${valorPagar}💵`
    );
  }
}

function ValorApostar() {
  return Math.floor(Math.floor(Math.random() * 1000));
}

function StarGame() {
  const jugador1 = CriarJogador("Jugador1");
  const jugador2 = CriarJogador("Jugador2");
  const jugador3 = CriarJogador("Jugador3");
  const jugador4 = CriarJogador("Jugador4");
  const jugador5 = CriarJogador("Jugador5");
  const jugador6 = CriarJogador("Jugador6");

  HacerApuesta(jugador1, ValorApostar(), LADO_A);
  HacerApuesta(jugador2, ValorApostar(), LADO_A);
  HacerApuesta(jugador3, ValorApostar(), LADO_A);
  HacerApuesta(jugador4, ValorApostar(), LADO_B);
  // HacerApuesta(jugador5, ValorApostar(), LADO_B);
  // HacerApuesta(jugador6, ValorApostar(), LADO_B);

  GerarRuleta();

  let ladoGanador = RULETA[GerarNumeroAleatorio()];
  console.log(
    `Total Mesa: ${mesa.total} / Lado A(${LADO_A}): ${mesa.porcentagemA} - Lado B(${LADO_B}): ${mesa.porcentagemB}`
  );
  console.log("O lado ganador é " + ladoGanador.lado);
  PagarJogadores(ladoGanador.lado);
}

function ValoresGerarNumeroAletorio(valorA, valorb) {
  if (valorA > valorb)
    return {
      MIN: valorb,
      MAX: valorA,
    };

  return {
    MIN: valorA,
    MAX: valorb,
  };
}

function GerarNumeroAleatorio() {
  let valores = ValoresGerarNumeroAletorio(
    Number(mesa.porcentagemA),
    Number(mesa.porcentagemB)
  );
  return Math.floor(Math.random() * (valores.MAX - valores.MIN) + valores.MIN);
}

function CriarJogador(nome) {
  return {
    id: (Math.random() * 100 + 1).toFixed(2),
    nome: nome,
    valorApostado: 0,
    porcentagem: 0,
    lado: null,
  };
}

function HacerApuesta(jugador, valor, lado) {
  const valoresDoLado = mesa.jugadores
    .filter((x) => x.lado == lado)
    .map((x) => x.valorApostado);
  const totalValor = valoresDoLado.reduce(
    (accumulator, value) => accumulator + value,
    0
  );
  let nuevoTotal = totalValor + valor;

  if (lado == LADO_A) {
    mesa.totalLadoA = nuevoTotal;
    jugador.valorApostado = valor;
    jugador.lado = LADO_A;
    mesa.jugadores.push(jugador);
    RecalcularValoresPagarJugadoresLadoA();
    RecalcularValorGeralMesa();
    return;
  }

  mesa.totalLadoB = nuevoTotal;
  jugador.valorApostado = valor;
  jugador.lado = LADO_B;
  mesa.jugadores.push(jugador);
  RecalcularValoresPagarJugadoresLadoB();
  RecalcularValorGeralMesa();
}

function RecalcularValoresPagarJugadoresLadoA() {
  const jugadores = mesa.jugadores.filter((x) => x.lado == LADO_A);
  RecalcularPorcentagemPagarJugadores(jugadores, mesa.totalLadoA);
}

function RecalcularValoresPagarJugadoresLadoB() {
  const jugadores = mesa.jugadores.filter((x) => x.lado == LADO_B);
  RecalcularPorcentagemPagarJugadores(jugadores, mesa.totalLadoB);
}

function RecalcularPorcentagemPagarJugadores(list = [], valortotal = 0) {
  for (let i = 0; i < list.length; i++) {
    const jugador = list[i];
    jugador.porcentagem = CalcularPorcentagemAReceberPorValor(
      jugador.valorApostado,
      valortotal
    );
  }
}

function RecalcularValorGeralMesa() {
  let totalGeral = mesa.totalLadoA + mesa.totalLadoB;
  let porcentagemLadoA = CalcularPorcentagemAReceberPorValor(
    mesa.totalLadoA,
    totalGeral
  );
  let porcentagemLadoContrario = PORCENTAGEM_PADRAO - porcentagemLadoA;

  mesa.total = totalGeral;
  mesa.porcentagemA = porcentagemLadoA;
  mesa.porcentagemB = porcentagemLadoContrario;
}

function GerarRuleta() {
  let porA = parseFloat(mesa.porcentagemA);
  let porB = parseFloat(mesa.porcentagemB);
  let ladoAMAIOR = porA > porB;
  let porcentagemMaior = ladoAMAIOR ? porA : porB;
  let ladoMaior = ladoAMAIOR ? LADO_A : LADO_B;
  let ladoContrario = LADO_A == ladoMaior ? LADO_B : LADO_A
  for (let i = 0; i < PORCENTAGEM_PADRAO; i++)
    RULETA[i] =
      i <porcentagemMaior
        ? {
            id: i + 1,
            lado: ladoMaior,
          }
        : {
            id: i + 1,
            lado: ladoContrario,
          };
  shuffleArray(RULETA);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

StarGame();
