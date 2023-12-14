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
export const ChatComponent = () => {
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
  const abrirChat = () => setVisibleChat(true);
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
    const dataEnvio = {
      username: Usuario.Nombre,
      img: Usuario.FotoAvatar,
      mensaje: mensage,
    };

    sendMessage(dataEnvio);
    data["chat-input"].value = "";
  };
  useEffect(() => {
    if (readyState == 1 && lastJsonMessage != null) {
      setMessage(lastJsonMessage);
    } else {
      setMessage([]);
    }
  }, [lastJsonMessage]);

  useEffect(() => {}, [readyState]);
  useEffect(() => {}, []);

  return (
    <>
      {!visibleChat && (
        <div id="chat-circle" onClick={abrirChat}>
          <div id="chat-overlay"></div>
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
          <ChatMessages className="chat-logs">
            {message.map((msg, i) => (
              <div
                key={"cm-msg-" + i}
                id={"cm-msg-" + i}
                className={"chat-msg" + "user" + " row mb-2 "}
              >
                {msg.username == Usuario.Nombre && Usuario.Nombre != "" ? (
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
                      <div className="cm-msg-text">{msg.mensaje}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-10 pe-0">
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
