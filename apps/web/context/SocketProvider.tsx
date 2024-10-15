"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: string) => any;
  messages: string[];
}

export const socketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(socketContext);
  // console.log(state, "This is state");
  if (!state) {
    throw new Error("state is undefined");
  }
  return state;
};


export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages,setMessages] = useState<string[]>([])
  const onMessageRec = useCallback((msg: string) => {
    console.log("Msg received from server", msg);
    const message = msg
    setMessages((prev) => [...prev,message])
  },[])
  
  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg) => {
      console.log("Send message", msg);
      if (socket) {
        socket.emit("event:message", msg);
      }
    },
    [socket]
  );

  useEffect(() => {
    const _socket = io("http://localhost:8000");
    _socket.on('message',onMessageRec)
    setSocket(_socket);
    return () => {
      _socket.disconnect();
      _socket.off('message',onMessageRec);
      setSocket(undefined);
      console.log("Socket disconnected");
    };
  }, []);

  return (
    <socketContext.Provider value={{ sendMessage,messages }}>
      {children}
    </socketContext.Provider>
  );
};
