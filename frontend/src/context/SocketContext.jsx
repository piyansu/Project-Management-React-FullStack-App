// src/context/SocketContext.js (or a similar location)

import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children, userId }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userId) return; // Don't connect if there's no user logged in

    // Connect to the server, passing the userId as a query parameter
    const newSocket = io(`${import.meta.env.VITE_URL_BACKEND}`, {
      query: { userId },
    });

    setSocket(newSocket);

    // Cleanup on component unmount
    return () => newSocket.close();
  }, [userId]); // Re-connect if the userId changes

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};