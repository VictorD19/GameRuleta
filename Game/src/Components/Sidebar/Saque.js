import { Button, Form } from "react-bootstrap";
import { ModalComponent } from "../Modal/Modal";

export const ModalSaque = ({ show, close }) => {
  const onSubmitSaque = () => {};
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
