'use client'
import { Form } from "react-bootstrap";

export const InputFile = () => {
  return (
    <Form.Group controlId="formFile" className="mb-3">
      <Form.Label>Imagem de Perfil</Form.Label>
      <Form.Control type="file" />
    </Form.Group>
  );
};
