import { FaCircle } from "react-icons/fa";

const LadosRuleta = [
  {
    Valor: 1,
    Icon: <FaCircle color="#0d6efd" />,
  },
  {
    Valor: 2,
    Icon: <FaCircle color="#dc3545" />,
  },
];

function ObterDadosLado(idLado = 1) {
  let [ladoSelecionado] = LadosRuleta.filter((x) => x.Valor == idLado);

  if (ladoSelecionado == null) return LadosRuleta[0];

  return ladoSelecionado;
}
export { ObterDadosLado };
