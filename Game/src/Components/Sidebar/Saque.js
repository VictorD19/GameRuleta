import { Button, Form } from "react-bootstrap";
import { ModalComponent } from "../Modal/Modal";
import { executarREST } from "@/Api";
import { useDataContext } from "@/Context";
import { useEffect } from "react";
import { useAuthHook } from "@/Hooks/AuthHook";
import { useRedirectApp } from "@/Hooks/RoutesHooks";
import { CriarAlerta, TIPO_ALERTA } from "../Alertas/Alertas";

export const ModalSaque = ({ show, close }) => {
  const { appData, dispatch, loading } = useDataContext();
  const { Usuario } = appData;
  const { SessionLoginActiva } = useAuthHook();
  const { IrPara } = useRedirectApp();
  const onSubmitSaque = async (e) => {
    e.preventDefault();
    let data = e.target;
    const valor = data["valorSaque"].value;
    const chavePix = data["chavePix"].value;
    const llaveTipo = data["group1"].value;

    // if (parseFloat(valor) > Usuario.Ganancias)
    //   return CriarAlerta(
    //     TIPO_ALERTA.ERROR,
    //     null,
    //     "Você não pode retirar uma quantidade maior que a disponivel R$" +
    //       parseFloat(`${Usuario.Ganancias}`).toFixed(2)
    //   );

    if (parseFloat(valor) < 50)
      return CriarAlerta(TIPO_ALERTA.ERROR, null, "Monto minimo para saque R$50");

    loading.ativarLoading();
    const { error } = await executarREST("user/retiro/", "POST", {
      userId: Usuario.Id,
      monto: valor,
      chavePix: chavePix,
      llaveTipo,
    });
    loading.desativarLoading();
    if (error) return CriarAlerta(TIPO_ALERTA.ERROR, null, error);
    let novoSaldo = {
      Saldo: (Usuario.Saldo - valor).toFixed(2),
    };
    loading.ativarLoading();
    dispatch({ tipo: "DADOS_USUARIO", data: novoSaldo });
    CriarAlerta(TIPO_ALERTA.SUCESSO, null, "Saque solicitado com sucesso");
    loading.desativarLoading();

    data["valorSaque"].value = 0;
    data["chavePix"].value = "";
    close();
  };

  useEffect(() => {
    if (!SessionLoginActiva()) {
      close();
      IrPara("/");
      return;
    }
  }, [Usuario.Id, Usuario.Ganancias]);
  return (
    <ModalComponent show={show} cerrarModal={close} titulo={"Saque"}>
      <Form onSubmit={onSubmitSaque}>
        <div>
          <label for="valorSaque" className="mb-2 ">
            <span> Valor do saque</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="name"
            id="valorSaque"
          />
        </div>
        <p className=" mt-1" style={{ color: "#c1c1c1", fontSize: "0.8em" }}>
          Diponivel: R${parseFloat(`${Usuario.Ganancias}`).toFixed(2)} - Monto
          minimo para saque R$50
        </p>
        <div className="mt-3">
          <label for="chavePix" className="mb-2">
            Informe sua chave Pix
          </label>
          <input
            type="text"
            className="form-control"
            name="chavePix"
            id="chavePix"
          />
        </div>
        <p className=" mt-3" style={{ color: "#c1c1c1", fontSize: "0.8em" }}>
          Taxa de saque de 5%. Transferência do valor solicitado em até 24
          horas.
        </p>
        <label className="mb-2 mt-2 text-bold">Tipo Chave</label>
        <div className="mb-3" style={{ color: "#c1c1c1" }}>
          <Form.Check
            inline
            label="CPF/CNPJ"
            name="group1"
            type="radio"
            value="cpfCnpj"
            id={`cpfcnpj`}
          />
          <Form.Check
            inline
            label="Telefone"
            name="group1"
            type="radio"
            value="telefone"
            id={`telefone`}
          />
          <Form.Check
            inline
            name="group1"
            label="Chave Aleatoria"
            type="radio"
            value="llaveAleatorio"
            id={`chavealeatoria`}
          />
          <Form.Check
            inline
            name="group1"
            label="E-mail "
            type="radio"
            value="email"
            id={`email`}
          />
        </div>

        <div className="mt-4 d-flex justify-content-end">
          <Button type="submit" className="w-100" variant="success">
            Sacar
          </Button>
        </div>
      </Form>
    </ModalComponent>
  );
};
