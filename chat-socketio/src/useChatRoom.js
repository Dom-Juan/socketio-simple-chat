import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_MESSAGE_EVENT = "new-message-event";
const SOCKET_SERVER_URL = "http://localhost:3030";

const useChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    // Cria um novo cliente com o server do nosso url.
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);

    // Espera uma mensagem nova.
    socketRef.current.on(NEW_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        isOwner: message.senderId === socketRef.current.id,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = (messageBody) => {
    socketRef.current.emit(NEW_MESSAGE_EVENT, {
      body: messageBody,
      senderId: socketRef.current.id,
    });
  };

  return { messages, sendMessage };
};

export default useChatRoom;