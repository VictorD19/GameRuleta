
let mesa = {
    jugadores: [],
    total: 0.00,
    totalLadoA: 0.00,
    totalLadoB: 0.00,
    porcentagemA: 0,
    porcentagemB: 0,
};
const LADO_A= "❤️";
const LADO_B= "🩵";
const PORCENTAGEM_PADRAO = 100;
const RULETA = [];
//Los lado seran definidos por 0 e 1 siendo 0(Azul) 🩵 ❤️ e 1(rojo)

//Calcula valor a pagar ao jogador por porcentagem correspondete
function   CalcularValorPagarPorPorcentagem(porcentagem = 0.00, valorTotal = 0.00  ){
    let resultadoMultiplicacao = porcentagem * valorTotal;
    let valorPagar = resultadoMultiplicacao/100;
    return valorPagar.toFixed(2);
}

//Calcula a % correspondente ao jogador deacordo a valor inserido por ele
function  CalcularPorcentagemAReceberPorValor(valorInserido = 0.00,valorTotal = 0.00){
    let porcentagem = (valorInserido*100) /valorTotal;
    return porcentagem.toFixed(2);  
}

function PagarJogadores(){

}

function  StarGame(){
    const jugador1 = CriarJogador("Jugador1");
    const jugador2 = CriarJogador("Jugador2");
    const jugador3 = CriarJogador("Jugador3");
    const jugador4 = CriarJogador("Jugador4");
    const jugador5 = CriarJogador("Jugador5");
    const jugador6 = CriarJogador("Jugador6");

    HacerApuesta(jugador1,20,LADO_A);
    HacerApuesta(jugador2,10,LADO_A);
    HacerApuesta(jugador3,55,LADO_A);
    HacerApuesta(jugador4,30,LADO_B);
    HacerApuesta(jugador5,40,LADO_B);
    HacerApuesta(jugador6,50,LADO_B);

    GerarRuleta(mesa.porcentagemA);
    shuffleArray(RULETA);

    let ladoGanador = Math.floor(Math.random() * 100);
    
    console.log(mesa)
}

function  CriarJogador(nome){
    return {
        id: ((Math.random() * 100 )+ 1).toFixed(2),
        nome: nome,
        valorApostado: 0,
        porcentagem: 0,
        lado:null
    }
}


function HacerApuesta(jugador,valor,lado){
    const valoresDoLado = mesa.jugadores.filter( x=> x.lado ==lado ).map(x => x.valorApostado);
    const totalValor = valoresDoLado.reduce((accumulator,value) => accumulator + value,0);
    let nuevoTotal = totalValor + valor;
   
    if(lado ==LADO_A){
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



function RecalcularValoresPagarJugadoresLadoA(){
    const jugadores =  mesa.jugadores.filter(x => x.lado == LADO_A);
    RecalcularPorcentagemPagarJugadores(jugadores,mesa.totalLadoA);
}

function RecalcularValoresPagarJugadoresLadoB(){
    const jugadores =  mesa.jugadores.filter(x => x.lado == LADO_B);
    RecalcularPorcentagemPagarJugadores(jugadores,mesa.totalLadoB);
}

function RecalcularPorcentagemPagarJugadores(list =[],valortotal = 0){
 for (let i = 0; i < list.length; i++) {
    const jugador = list[i];
    jugador.porcentagem = CalcularPorcentagemAReceberPorValor(jugador.valorApostado,valortotal);
 }
}

function RecalcularValorGeralMesa(){
    let totalGeral = mesa.totalLadoA + mesa.totalLadoB;
    let porcentagemLadoA = CalcularPorcentagemAReceberPorValor(mesa.totalLadoA,totalGeral);
    let porcentagemLadoContrario = PORCENTAGEM_PADRAO - porcentagemLadoA;
    
    mesa.total = totalGeral;
    mesa.porcentagemA = porcentagemLadoA;
    mesa.porcentagemB = porcentagemLadoContrario;
}

function GerarRuleta(LadoA){
   for (let i = 0; i < PORCENTAGEM_PADRAO; i++) 
    RULETA[i] =  LadoA <= i ? {
        id : i+1,
        lado: LADO_A
    }: {
        id : i+1,
        lado: LADO_B
    };
}

 function shuffleArray(arr){
    let newArray = [];
    if(arr.length >= 2){
        while(newArray.length < arr.length){
            const rndIndex = Math.floor(Math.random() * (arr.length));
            if (newArray.indexOf(arr[rndIndex]) === -1) newArray.push(arr[rndIndex])
        }
    }
    return newArray;
}

StarGame();