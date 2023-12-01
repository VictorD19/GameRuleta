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
  const onSubmitSaque = (e) => {
    e.preventDefault();
    let data = e.target;
    const valor = data["valorSaque"].value;
    const chavePix = data["chavePix"].value;

    loading.ativarLoading();
    const { error, ...dataResponse } = executarREST("user/retiro/", "POST", {
      userId: Usuario.Id,
      monto: valor,
      chavePix: chavePix,
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
  }, []);
  return (
    <ModalComponent show={show} cerrarModal={close} titulo={"Saque"}>
      <Form onSubmit={onSubmitSaque}>
        <div>
          <label for="valorSaque" className="mb-2">
            Valor do saque
          </label>
          <input
            type="text"
            className="form-control"
            name="name"
            id="valorSaque"
          />
        </div>

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
        <div className="my-3 d-flex justify-content-end">
          <Button type="submit" variant="success">
            Sacar
          </Button>
        </div>
      </Form>
    </ModalComponent>
  );
};
