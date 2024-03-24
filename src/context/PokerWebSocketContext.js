// src/context/WebSocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { websocketService } from './PokerWebsocketService';
import { useAuth } from '../context/AuthContext';

const WebSocketContext = createContext();

export const PokerWebSocketProvider = ({ children }) => {
  const [gameState, setGameState] = useState(null);
  const navigate = useNavigate();

  const {user} = useAuth();

  useEffect(() => {
      if (!websocketService.ws) {
          websocketService.connect();
      }

      const handleMessage = (data) => {
          switch (data.action) {
            case 'updateGameState':
              const isSpectatorUpdate = data.gameDetails.waitingPlayers?.some(playerId => playerId === user.username);
              setGameState({ ...data.gameDetails, isSpectator: isSpectatorUpdate });
              break;
            case 'createGame':
              localStorage.setItem('gameId', data.gameDetails.gameId);
              setGameState(data.gameDetails);
              navigate(`/poker-game/${data.gameDetails.gameId}`);  
              break;
            case 'joinGame':
              localStorage.setItem('gameId', data.gameDetails.gameId);
              setGameState(data.gameDetails);
              navigate(`/poker-game/${data.gameDetails.gameId}`); // Should be handled somewhere else
              break;
            case 'leaveGame':
              break;
            case 'playerCall':
              setGameState(data.game); // Update the gameState with the new game state received
              break;
            case 'playerRaise':
              setGameState(data.game); // Update the gameState with the new game state received
              break;
            case 'playerFold':
              setGameState(data.game); // Update the gameState with the new game state received
              break;
            case 'playerCheck':
              setGameState(data.game); // Update the gameState with the new game state received
              break;
            case 'playerReady':
              setGameState(data.game); // Update the gameState with the new game state received
              break;
            case 'waitingForNextGame':
              localStorage.setItem('gameId', data.gameDetails.gameId);
              // setGameState({ ...data.gameDetails, isSpectator: true });
              setGameState({ ...data.gameDetails, isSpectator: true });
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

  const sendPlayerAction = (action, payload) => {
      websocketService.sendMessage(action, payload);
  };

  return (
      <WebSocketContext.Provider value={{ gameState, sendPlayerAction, setGameState }}>
          {children}
      </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);