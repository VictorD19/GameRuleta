"use client";
import { useState } from "react";
import { IoIosChatboxes, IoIosSend, IoMdClose } from "react-icons/io";
import "./chat.style.css";
import { Button, Form } from "react-bootstrap";

export const ChatComponent = () => {
  const [message, setMessage] = useState([]);

  return (
    <>
      <div id="chat-circle" className="">
        <div id="chat-overlay"></div>
        <IoIosChatboxes size={30} />
      </div>

      <div className="chat-box">
        <div className="chat-box-header">
          Chat
          <span className="chat-box-toggle">
            <IoMdClose>close</IoMdClose>
          </span>
        </div>
        <div className="chat-box-body">
          <div className="chat-box-overlay"></div>
          <div className="chat-logs"></div>
        </div>
        <div className="chat-input">
          <Form>
            <Form.Control
              type="text"
              id="chat-input"
              placeholder="Enviar menssage..."
            />
            <Button type="submit" className="chat-submit" id="chat-submit">
              <IoIosSend />
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};
