"use client";
import { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import Nav from "react-bootstrap/Nav";

export default function MenuLateral() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <Offcanvas show={true} onHide={handleClose}>
      <Offcanvas.Header>
        <Offcanvas.Title>Titulo</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Nav defaultActiveKey="/" className="flex-column">
          <Nav.Link href="/">Inicio</Nav.Link>
          <Nav.Link eventKey="/Inicio">Inicio 2</Nav.Link>
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
