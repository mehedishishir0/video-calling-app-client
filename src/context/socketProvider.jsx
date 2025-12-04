import React, { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";

const ScoketContext = createContext(null);


export const useSocket = () => {
    const soket = useContext(ScoketContext);
    return soket;
}

export const SocketProvider = ({ children }) => {
  const socket = useMemo(() => io("https://video-calling-app-server-9unm.onrender.com"), []);

  return (
    <ScoketContext.Provider value={socket}>{children}</ScoketContext.Provider>
  );
};
