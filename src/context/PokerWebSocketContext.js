// src/context/WebSocketContext.js
import React, { createContext, useContext, useEffect } from 'react';
import { websocketService } from './PokerWebsocketService';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
    useEffect(() => {
        if (!websocketService.ws) {
            websocketService.connect();
        }
    
        return () => {
            // Ensure we only attempt to disconnect if the connection is open.
            // The readyState of 1 indicates that the connection is open.
            if (websocketService.ws && websocketService.ws.readyState === WebSocket.OPEN) {
                websocketService.disconnect();
            }
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{}}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
