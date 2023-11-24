"use client";
import { useAuthHook } from "@/Hooks/AuthHook";
import { useRedirectApp } from "@/Hooks/RoutesHooks";
import { useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";

const PERGUNTAS_REPOSTA = [
  {
    TITULO: "O que é NomeSite?",
    DESCRICION:
      "É um novo serviço de loteria rápida,. O princípio deste serviço é extremamente simples e compreensível — escolher uma cor e ganhar dinheiro.",
  },
  {
    TITULO: "Salas",
    DESCRICION: `Oferecemos 3 salas com diferentes quantidades de taxas máximas e mínimas: de 1 a 200 rublos
    de 10 a 2000 rublos
    de 100 a 20.000 rublos
    Você podera visualizar e apostar em cada uma delas se desejar.
    `,
  },
  {
    TITULO: "Como Funciona o Jogo?",
    DESCRICION: `Você precisa entrar em uma das salas e apostar em qualquer valor (dentro desta sala) em vermelho ou azul. Quando pelo menos 2 jogadores fazem suas apostas, o jogo começa automaticamente. Em seguida, o gerador seleciona aleatoriamente uma das duas cores, e o jogador que apostar nele leva uma vitória .
    Importante: quanto mais dinheiro do seu lado, maior a chance de ganhar. E quanto mais sua participação na equipe (se várias pessoas colocarem uma cor), maior será a quantidade de ganhos.
    `,
  },
  {
    TITULO: "Qual é o valor minimo de retirada?",
    DESCRICION: `O valor mínimo para retirada é de apenas R$ 50.
    `,
  },
  {
    TITULO: "Como funciona o Saque?",
    DESCRICION: `É importante resaltar que você não pode pedir um pagamento além de seus ganhos. Se você reabasteceu a conta em R$ 100 e ganhou (jogou) 30, então você pode retirar apenas R$ 30. Isso é feito para que os participantes do sistema não lavem dinheiro. Os pagamento são realizado em até 24Hr.
    `,
  },
  {
    TITULO: "Como funciona a Recarga?",
    DESCRICION: `Para recarregar é simples, ir até opção no menu inserir o valor que deseja recarregar e selecionar o metodo de pagamento, apoós a confirmação do seu pagamento os credito serão adicionados a sua conta.`,
  },
];

export default function Page() {
  const { SessionLoginActiva } = useAuthHook();
  const { IrPara } = useRedirectApp();
  useEffect(() => {
    if (!SessionLoginActiva()) return IrPara();
  }, []);
  return (
    <div className="px-2">
      <div className="card bg-dark text-white">
        <div className="card-body">
          <h2 className="mb-3">Perguntas Frecuentes</h2>

          <Accordion defaultActiveKey="0" flush>
            {PERGUNTAS_REPOSTA.map((item, i) => (
              <Accordion.Item eventKey={i} key={"pergunta" + i}>
                <Accordion.Header>{item.TITULO}</Accordion.Header>
                <Accordion.Body>{item.DESCRICION}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
