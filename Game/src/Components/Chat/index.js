"use client";
import { useEffect, useState } from "react";
import { IoIosChatboxes, IoIosSend, IoMdClose } from "react-icons/io";
import "./chat.style.css";
import { Form } from "react-bootstrap";
import { ChatBody, ChatBox, ChatHeader, ChatMessages } from "./chat.styled";
import Profiles from "../../Assert/Profile";
import Image from "next/image";
import useWebSocket from "react-use-websocket";
import { URL_PADRAO_SOCKET } from "@/Api";
import { useDataContext } from "@/Context";
import { useAuthHook } from "@/Hooks/AuthHook";
import { CriarAlerta, TIPO_ALERTA } from "../Alertas/Alertas";

function validarString(valor) {
  var regex = /\S/;
  return regex.test(valor);
}

export const ChatComponent = () => {
  const [novosMensagem, setNovosMensagems] = useState({
    atual: 0,
    naoLidas: 0
  })
  const { sendMessage, lastMessage, lastJsonMessage, readyState } =
    useWebSocket(URL_PADRAO_SOCKET + "/chat/chat-general", {
      shouldReconnect: () => true,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
    });

  const [message, setMessage] = useState([]);
  const [visibleChat, setVisibleChat] = useState(false);
  const { SessionLoginActiva } = useAuthHook();
  const { appData } = useDataContext();
  const { Usuario } = appData;
  const abrirChat = () => {
    setVisibleChat(true);
    setNovosMensagems(atual => ({ ...atual, naoLidas: 0 }))
  }
  const fecharChat = () => setVisibleChat(false);
  const enviarMensaje = (e) => {
    e.preventDefault();
    if (!SessionLoginActiva())
      return CriarAlerta(
        TIPO_ALERTA.ERROR,
        null,
        "Entre na sua conta para enviar mensagems"
      );
    let data = e.target;
    const mensage = data["chat-input"].value;

    if (!validarString(mensage))
      return CriarAlerta(
        TIPO_ALERTA.ATENCAO,
        null,
        "Ensira um texto valido para enviar"
      );

    const dataEnvio = {
      username: Usuario.Nombre,
      img: Usuario.FotoAvatar,
      mensaje: mensage.trim(),
    };

    sendMessage(JSON.stringify(dataEnvio));
    data["chat-input"].value = "";

    let chat = document.getElementById("chat-logs");
    chat.scrollTop = chat.scrollHeight;
    setNovosMensagems(atual => ({ ...atual, naoLidas: 0 }))
  };
  useEffect(() => {
    if (readyState == 1 && lastJsonMessage != null) {
      setMessage(lastJsonMessage);
      setNovosMensagems(temp => novosMensagem.atual != lastJsonMessage.length ?
        {
          atual: lastJsonMessage.length,
          naoLidas: novosMensagem.atual == 0 && novosMensagem.atual == 0 ? lastJsonMessage.length : visibleChat ? novosMensagem.atual - lastJsonMessage.length : lastJsonMessage.length
        } : temp
      )
    } else {
      setMessage([]);
    }
  }, [lastJsonMessage]);

  useEffect(() => { }, [readyState]);
  return (
    <>
      {!visibleChat && (
        <div id="chat-circle" onClick={abrirChat}>
          <div id="chat-overlay"></div>
          {novosMensagem.naoLidas > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {novosMensagem.naoLidas == -1 ? 0 : novosMensagem.naoLidas}
            <span className="visually-hidden">unread messages</span>
          </span>}
          <IoIosChatboxes size={30} />
        </div>
      )}
      <ChatBox $visible={visibleChat}>
        <ChatHeader>
          Chat
          <span className="chat-box-toggle" onClick={fecharChat}>
            <IoMdClose>close</IoMdClose>
          </span>
        </ChatHeader>
        <ChatBody>
          <div className="chat-box-overlay"></div>
          <ChatMessages className="chat-logs" id="chat-logs">
            {message != null &&
              message.length > 0 &&
              message.map((msg, i) => (
                <div
                  key={"cm-msg-" + i}
                  id={"cm-msg-" + i}
                  className={"chat-msg" + "user" + " row mb-2 "}
                >
                  {msg.username == Usuario.Nombre && Usuario.Nombre != "" ? (
                    <>
                      <div className="col-10 pe-0">
                        <h5 style={{ fontSize: "0.9em", color: "#000" }}>
                          {msg.username}
                        </h5>
                        <div className="cm-msg-text">{msg.mensaje}</div>
                      </div>
                      <div className="col-2 pe-3">
                        <span className="msg-avatar ">
                          <Image
                            style={{ borderRadius: "50%" }}
                            src={Profiles[msg.img]}
                            width={45}
                            alt="chat-profile"
                          />
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-2 ps-3">
                        <span className="msg-avatar ">
                          <Image
                            style={{ borderRadius: "50%" }}
                            src={Profiles[msg.img]}
                            width={45}
                            alt="chat-profile"
                          />
                        </span>
                      </div>
                      <div className="col-10 ps-0">
                        <div className="px-1">
                          <div style={{ fontSize: "0.9em", color: "#000" }}>
                            {msg.username}
                          </div>
                          <div className="cm-msg-text">{msg.mensaje}</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
          </ChatMessages>
        </ChatBody>
        <div className="chat-input">
          <Form onSubmit={enviarMensaje}>
            <input
              type="text"
              id="chat-input"
              placeholder="Enviar menssage..."
            />
            <button type="submit" className="chat-submit" id="chat-submit">
              <IoIosSend size={30} />
            </button>
          </Form>
        </div>
      </ChatBox>
    </>
  );
};
