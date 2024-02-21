// src/context/WebSocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { websocketService } from './PokerWebsocketService';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
    const [gameState, setGameState] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!websocketService.ws) {
            websocketService.connect();
        }

        const handleMessage = (data) => {
            switch (data.action) {
              case 'updateGameState':
                setGameState(data.gameDetails);
                break;
              case 'createGame':
                localStorage.setItem('gameId', data.gameDetails.gameId);
                setGameState(data.gameDetails);
                navigate(`/poker-game/${data.gameDetails.gameId}`);
                break;
              case 'joinGame':
                localStorage.setItem('gameId', data.gameDetails.gameId);
                setGameState(data.gameDetails);
                navigate(`/poker-game/${data.gameDetails.gameId}`);
                break;
              default:
                console.log('Unhandled message action:', data.action);
            }
          };

        websocketService.addMessageListener(handleMessage);


    
        return () => {
            // Ensure we only attempt to disconnect if the connection is open.
            // The readyState of 1 indicates that the connection is open.
            if (websocketService.ws && websocketService.ws.readyState === WebSocket.OPEN) {
                websocketService.disconnect();
                websocketService.removeMessageListener(handleMessage);
            }
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ gameState }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
