'use client'
import Accordion from "react-bootstrap/Accordion";

const PERGUNTAS_REPOSTA = [
  {
    TITULO: "Como jogar, qual é o objetivo?",
    DESCRICION:
      " A conclusão é que uma variedade de participantes façam suas apostas no campo do azul ou do vermelho. Após a conclusão do sorteio, a totalidade do montante é direcionada aos jogadores do lado triunfante.",
  },
  {
    TITULO: "Quais são as características do site FUNCOMBAT?",
    DESCRICION: `Nossa distinção em relação às loterias convencionais reside na total honestidade e transparência. É possível visualizar a quantidade e detalhes das apostas realizadas, o montante total do prêmio, assim como avaliar os riscos e as chances de sucesso. Esta abordagem inovadora proporciona uma clareza sem precedentes em comparação com os métodos tradicionais.
    `,
  },

  {
    TITULO: "Como é selecionado o ganhador?",
    DESCRICION: `Quando o cronômetro do jogo atinge 0, o sorteio começa. As chances de cada lado ganhar são calculadas como a proporção da quantidade de dinheiro que é colocada deste lado para o banco comum. 
    Por exemplo:
    Eles colocam R$ 100,00  no lado vermelho, R$ 300,00 no lado azul. Isso significa que o lado azul tem 3 vezes mais chances de ganhar do que o vermelho. Ou seja, neste exemplo, a probabilidade de que o lado vermelho ganhe é de 25%, a probabilidade de que o lado azul ganhe é de 75%.
    Assim, a parte vencedora é determinada, preste atenção ao fato de que não é a parte que tem mais probabilidade de ganhar, mas o lado aleatório, levando em conta suas chances.
    `,
  },
  {
    TITULO: "Posso jogar se não tiver 18 anos?",
    DESCRICION: `Não! Nosso serviço é destinado apenas para pessoas que atingiram a idade adulta. Se você não tem 18 anos, por favor, deixe o nosso site`,
  },
  {
    TITULO: "Ganhei uma boa quantia e quero fazer um saque! quanto tempo leva para processar o pagamento?",
    DESCRICION: `Após solicitado o saque seu pagamento será processado em até 24hrs
    `,
  },
  {
    TITULO: "Como funciona o Saque?",
    DESCRICION: `É importante resaltar que você não pode pedir um pagamento além de seus ganhos. Se você reabasteceu a conta em R$ 100 e ganhou (jogou) 30, então você pode retirar apenas R$ 30. Isso é feito para que os participantes do sistema não lavem dinheiro. Os pagamento são realizado em até 24Hr.
    `,
  },
  {
    TITULO: "Quais são o metodos de pagamento que você possuim ?",
    DESCRICION: `No momento vamos trabalhar apenas com pix, mas iremos ir acrescentando outras formas assim que possível.`,
  },
  {
    TITULO: "Se eu convidar outro jogadores ira ganhar uma comissão?",
    DESCRICION: `Teremos momento que iremos oferecer bônus por indicação, então esteja atento a nossos anúncios.`,
  },
  {
    TITULO: "Qual é a aposta minima?",
    DESCRICION: `Dependendo da sala você tera uma aposta minima indo de R$ 1,00 na Sala Nº1 até R$ 100,00 na Sala Nº3`,
  },
];

export default function Page() {

  return (
    <div className="px-2">
      <h2 className="mt-3">Respostas a perguntas frequentes</h2>
      <h6 className="mb-4" style={{ color: "#c1c1c1" }}>Respostas a perguntas frequentes de nossos usuários</h6>

      <div className="card bg-dark text-white">
        <div className="card-body">


          {PERGUNTAS_REPOSTA.map((item, i) => (

            <div key={"pergunta" + i}>
              <h4 style={{ color: "#f29a0b" }}>{item.TITULO}</h4>
              <p>{item.DESCRICION}</p>
            </div>

          ))}
        </div>
      </div>
    </div>
  );
}
