import { Button, Form, FormControl } from "react-bootstrap";
import { ModalComponent } from "../Modal/Modal";
import { CriarAlerta, TIPO_ALERTA } from "../Alertas/Alertas";
const URL_PADRAO = "http://localhost:8000/user/login/";
export const LoginModal = ({ show, cerrarModal }) => {
  const loginApp = async (event) => {
    event.preventDefault();
    let data = event.target;
    const usuario = data["usuario"].value;
    const senha = data["senha"].value;

    if (usuario.length <= 6 || !senha)
      return CriarAlerta(TIPO_ALERTA.ERROR, null, "Usuario e Senha invalidos");

    let retorno = fetch(URL_PADRAO, {
      method: "POST",
      body: {
        
      },
    });
    console.log(usuario, senha);
  };
  return (
    <ModalComponent titulo={"Entrar"} show={show} cerrarModal={cerrarModal}>
      <Form onSubmit={loginApp}>
        <Form.Label htmlFor="usuario">Usuario</Form.Label>
        <FormControl type="text" id="usuario" className="mb-3" required />
        <Form.Label htmlFor="senha">Senha</Form.Label>
        <FormControl type="password" className="mb-2" required id="senha" />
        <div className="links">
          <a
            href="#"
            style={{
              textDecoration: "underline",
              color: "#c1c1c1",
              fontSize: "0.8em",
            }}
          >
            Esqueceu a senha?
          </a>
        </div>

        <Button className="w-100 mt-3" type="submit" variant="success">
          Entrar
        </Button>
      </Form>
    </ModalComponent>
  );
};

export const RegistroModal = ({ show, cerrarModal }) => {
  const criarConta = (event) => {};

  return (
    <ModalComponent
      titulo={"Criar Conta"}
      show={show}
      cerrarModal={cerrarModal}
    >
      <Form onSubmit={criarConta}>
        <Form.Label htmlFor="usuario">Usuario</Form.Label>
        <FormControl type="text" className="mb-3" id="usuario" required />
        <Form.Label htmlFor="senha">Senha</Form.Label>
        <FormControl type="password" className="mb-3" id="senha" required />
        <Form.Label htmlFor="confirmacaoSenha">Confirmar Senha</Form.Label>
        <FormControl
          type="password"
          required
          className="mb-3"
          id="confirmacaoSenha"
        />
        <Button className="w-100 mt-3" type="submit" variant="success">
          Criar Conta
        </Button>
      </Form>
    </ModalComponent>
  );
};
