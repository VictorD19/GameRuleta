import Modal from "react-bootstrap/Modal";
import styled from "styled-components";
const ModalComp = styled(Modal)`
  @media only screen and (max-width: 767px) {
    width: 95%;
    margin: 0;
    padding-left: 0;
  }
  .modal-content{
    border: 1px solid rgba(13, 110, 253, 0.5);
  }
`;
export function ModalComponent({
  show = false,
  titulo,
  cerrarModal,
  children,
}) {
  return (
    <ModalComp show={show} onHide={cerrarModal} >
      <Modal.Header closeButton className="bg-dark border-bottom-0">
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark">{children}</Modal.Body>
    </ModalComp>
  );
}
