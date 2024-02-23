import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWebSocket } from '../context/PokerWebSocketContext'; 
import './PokerGame.css';
import axios from 'axios';
import PokerPlay from './PokerPlay';

const PokerGame = () => {
  const { gameId } = useParams();
//   const [gameState, setGameState] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

  // Ensure this URL is correct and points to your deployed API

  const apiUrl = "https://gxwbfjkt95.execute-api.us-east-1.amazonaws.com/dev";

  const { gameState, setGameState } = useWebSocket(); // Use gameState from context

  useEffect(() => {
    const fetchGameState = async () => {
        try {
        const response = await axios.get(`${apiUrl}/games/${gameId}/state`);
        setGameState(response.data);
        } catch (error) {
        console.error('Error fetching game state:', error);
        }
      };
  
      fetchGameState();
  }, []);

//   if (isLoading) {
//     return <div>Loading game state...</div>;
//   }

  if (!gameState) {
    return <div>Game not found or error loading game state.</div>;
  }

  if (gameState.gameStarted) {
    // Placeholder for when the game component is ready
    return <div><PokerPlay /></div>;
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
