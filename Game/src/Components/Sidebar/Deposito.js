"use client";
import { Button, Form, InputGroup } from "react-bootstrap";
import { ModalComponent } from "../Modal/Modal";
import { useEffect, useRef, useState } from "react";
import Image from "../../Assert/profile_defaul.png";
import { CriarAlerta, TIPO_ALERTA } from "../Alertas/Alertas";
import {
  InserirRegistroLocalStorage,
  LimparTudoLocalStorage,
  ObterItemLocalStorage,
  RemoverItemLocalStorage,
  executarREST,
} from "@/Api";
import { useDataContext } from "@/Context";
import { useAuthHook } from "@/Hooks/AuthHook";
import { useRedirectApp } from "@/Hooks/RoutesHooks";
const objetoPadrao = {
  Image64: "",
  CopiaPega: "",
  DataExpiracion: "",
  Valor: 0,
};
export const DepositoModal = ({ modalDeposito, cerrarModalDeposito }) => {
  const [dadosPix, setDadosPix] = useState(objetoPadrao);
  const { appData, dispatch, loading } = useDataContext();
  const { Usuario } = appData;
  const { SessionLoginActiva } = useAuthHook();
  const { IrPara } = useRedirectApp();
  const textArea = useRef(null);
  const onSubmitDeposito = async (e) => {
    e.preventDefault();
    let data = e.target;
    const valorDeposito = data["valorDeposito"].value;

    if (valorDeposito == 0)
      return CriarAlerta(TIPO_ALERTA.ERROR, null, "Insira um valor valido!");

    if (parseFloat(valorDeposito) < 10)
      return CriarAlerta(
        TIPO_ALERTA.ERROR,
        null,
        "Monto minino de deposito é R$10"
      );
    loading.ativarLoading();
    const { error, ...dataResponse } = await executarREST(
      `user/new-cobro-pix/${Usuario.Id}/${valorDeposito}`
    );
    loading.desativarLoading();
    if (error) return CriarAlerta(TIPO_ALERTA.ERROR, null, error);

    const novoPagamento = {
      Image64: dataResponse.encodedImage,
      CopiaPega: dataResponse.payload,
      DataExpiracion: dataResponse.expirationDate,
      Valor: valorDeposito,
      ID: dataResponse.idQr,
    };
    setDadosPix(novoPagamento);
    InserirRegistroLocalStorage("PixGerado", novoPagamento);
    CriarAlerta(
      TIPO_ALERTA.SUCESSO,
      null,
      "Codigo Pix gerado com sucesso, Pague agora para que seu saldo seja ativado"
    );
  };

  const copiarTexto = (e) => {
    e.preventDefault();
    let campoTextArea = textArea.current;
    campoTextArea.select();
    campoTextArea.setSelectionRange(0, 99999); /* Para dispositivos móveis */

    /* Copia o texto para a área de transferência */
    navigator.clipboard.writeText(campoTextArea.value);
    CriarAlerta(TIPO_ALERTA.SUCESSO, null, "Codigo copiado com sucesso");
  };

  useEffect(() => {
    if (!SessionLoginActiva()) return IrPara("/");

    const pixGeradoAnteriorMente = ObterItemLocalStorage("PixGerado");
    if (!pixGeradoAnteriorMente) {
      RemoverItemLocalStorage("PixGerado");
      setDadosPix(objetoPadrao);
      return;
    }

    const dataAtual = new Date();
    const dataExpiracionPix = new Date(pixGeradoAnteriorMente.DataExpiracion);

    if (dataAtual > dataExpiracionPix) {
      RemoverItemLocalStorage("PixGerado");
      setDadosPix(objetoPadrao);
      return;
    }

    (async () => {
      loading.ativarLoading();
      const { error, status } = executarREST(
        "user/status-pix/" + pixGeradoAnteriorMente.ID,
        "GET"
      );
      loading.desativarLoading();
      if (error) {
        RemoverItemLocalStorage("PixGerado");
        setDadosPix(objetoPadrao);
        return;
      }
      if (!status) setDadosPix(pixGeradoAnteriorMente);
      else {
        RemoverItemLocalStorage("PixGerado");
        setDadosPix(objetoPadrao);
      }
    })();

    return () => {
      setDadosPix(objetoPadrao);
    };
  }, [modalDeposito]);

  return (
    <ModalComponent
      show={modalDeposito}
      cerrarModal={cerrarModalDeposito}
      titulo={"Deposito"}
    >
      <Form onSubmit={onSubmitDeposito}>
        <div>
          <Form.Label> Digite o valor</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text>R$</InputGroup.Text>
            <Form.Control
              disabled={dadosPix.Image64}
              type="text"
              className="form-control"
              name="name"
              defaultValue={dadosPix.Valor}
              id="valorDeposito"
            />
          </InputGroup>
        </div>
        <div className=" my-3">
          <label for="metodoPagamento">Método de Deposito</label>
          <Form.Check
            defaultChecked={true}
            type={"radio"}
            label={`Pix`}
            id={`pix`}
          />
        </div>

        {dadosPix.Image64 != "" && (
          <div className="text-center my-2">
            <h6>Aponte sua Camera aqui para Pagar</h6>
            <img
              src={
                dadosPix.Image64 != null
                  ? "data:image/jpeg;base64," + dadosPix.Image64
                  : Image
              }
              width={300}
              height={300}
              alt="codigoPIX"
            />
            <Form.Group className="my-3" controlId="copiaColaTextArea">
              <Form.Label>ou copie o codigo</Form.Label>
              <Form.Control
                onClick={copiarTexto}
                style={{ background: "#c1c1c1", cursor: "pointer" }}
                disabled
                as="textarea"
                rows={3}
                ref={textArea}
                value={dadosPix.CopiaPega}
              />
            </Form.Group>
          </div>
        )}

        <div className="my-3 d-flex justify-content-center w-100">
          {dadosPix.Image64 == "" && (
            <Button type="submit" variant="success" className="px-5 py-2">
              Gerar Pix
            </Button>
          )}
          {dadosPix.Image64 != "" && (
            <div className="w-100 text-center">
              <div className="mb-3">
                <Button
                  type="button"
                  variant="success"
                  onClick={copiarTexto}
                  className="px-5 py-2"
                >
                  Copiar Codigo
                </Button>
              </div>
              <ul
                style={{ background: "#2A4968", borderRadius: "10px" }}
                className="py-3 text-start"
              >
                <li>
                  <b>Passo a passo para depositar</b>
                </li>
                <li>1 - Copie o codigo Gerado</li>
                <li>2 - Abra o aplicativo do seu banco</li>
                <li>3 - Selecione a opção de Pix</li>
                <li>4 - Va até a opção de pagar com Copia e Cola</li>
                <li>5 - Cole o codigo</li>
              </ul>
            </div>
          )}
        </div>
      </Form>
    </ModalComponent>
  );
};
