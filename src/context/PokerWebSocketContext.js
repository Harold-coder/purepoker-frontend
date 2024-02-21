// src/context/WebSocketContext.js
import React, { createContext, useContext, useEffect } from 'react';
import { websocketService } from './PokerWebsocketService';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
    useEffect(() => {
        websocketService.connect();

        return () => {
            websocketService.disconnect();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{}}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
