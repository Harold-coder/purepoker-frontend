import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { websocketService } from '../context/PokerWebsocketService'; 
import './PokerGame.css';

const PokerGame = () => {
  const { gameId } = useParams();
  const [gameState, setGameState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ensure this URL is correct and points to your deployed API
  const apiUrl = "https://gxwbfjkt95.execute-api.us-east-1.amazonaws.com/dev";

  useEffect(() => {
    // Define the handler function
    const handleGameStateUpdate = (data) => {
      if (data.action === 'updateGameState') {
        setGameState(data.data);
      }
    };
  
    // Set the onMessage handler to the new function
    websocketService.onMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleGameStateUpdate(data);
      } catch (error) {
        console.error('Error parsing message', error);
      }
    };

    const fetchGameState = async () => {
        setIsLoading(true);
        try {
        const response = await axios.get(`${apiUrl}/games/${gameId}/state`);
        // console.log(`${apiUrl}/games/${gameId}/state`);
        // console.log(response.data);
        setGameState(response.data);
        } catch (error) {
        console.error('Error fetching game state:', error);
        }
        setIsLoading(false);
    };

    fetchGameState();
  
  }, [gameId]);

  if (isLoading) {
    return <div>Loading game state...</div>;
  }

  if (!gameState) {
    return <div>Game not found or error loading game state.</div>;
  }

  if (gameState.gameStarted) {
    // Placeholder for when the game component is ready
    return <div>Game has started! (Render actual game component here)</div>;
  }

  return (
    <div className="pokerGameContainer">
      <h1 className="gameTitle">Poker Game Room</h1>
      <div className="gameStatus">
        <h2>Game ID: {gameId}</h2>
        <p>Waiting for players...</p>
        <p>Minimum players required to start: {gameState.minPlayers}</p>
        <p>Players currently in game: {gameState.playerCount}</p>
        <ul>
          {gameState.players.map((player, index) => (
            <li key={index}>{player.name || player.id}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PokerGame;
