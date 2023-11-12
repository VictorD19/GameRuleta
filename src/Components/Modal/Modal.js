
import Modal from "react-bootstrap/Modal";

export function ModalComponent({ show = false, titulo, cerrarModal, children }) {
  return (
    <Modal show={show} onHide={cerrarModal} >
      <Modal.Header closeButton  className="bg-dark border-bottom-0">
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body  className="bg-dark">{children}</Modal.Body>
    </Modal>
  );
}
