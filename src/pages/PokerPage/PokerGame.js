import React, { useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWebSocket } from '../../context/PokerWebSocketContext'; 
import './PokerGame.css';
import axios from 'axios';
import PokerPlay from '../../components/PokerComponents/PokerPlay';

const PokerGame = () => {
  const { gameId } = useParams();

  const apiUrl = "https://gxwbfjkt95.execute-api.us-east-1.amazonaws.com/dev";

  const { gameState, setGameState } = useWebSocket(); // Use gameState from context

  let navigate = useNavigate();

  useEffect(() => {
    const fetchGameState = async () => {
        try {
        const response = await axios.get(`${apiUrl}/games/${gameId}/state`, { withCredentials: false });
        setGameState(response.data);
        } catch (error) {
        console.error('Error fetching game state:', error);
        }
      };
  
      fetchGameState();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gameId).then(() => {
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  if (!gameState) {
    return <div>Game not found or error loading game state.</div>;
  }

  if (gameState.gameStarted) {
    // Placeholder for when the game component is ready
    return <div className='poker-area'><PokerPlay /></div>;
  }

  // Function to navigate home
  const navigateToPokerLobby = () => navigate('/poker-game');

  return (
    <div className="pokerGameContainer">
        <button className="pokerLobbyButton" onClick={navigateToPokerLobby} title="Go to home">
                <i className="fas fa-home"></i>
        </button>
      <h1 className="gameTitle">Poker Game Room</h1>
      <div className="gameStatus">
        <h2>Game ID: {gameId}
            <button onClick={copyToClipboard} className="copy-button" title="Copy to Clipboard">
                <i className="fas fa-copy"></i>
            </button>
        </h2>

        <p>Minimum number of players required: <span className='bold-text'>{gameState.minPlayers}</span></p>
        <p>Players currently in game:</p>
        <ul>
          {gameState.players.map((player, index) => (
            <li key={index}>{player.name || player.id}</li>
          ))}
        </ul>
        <p>Waiting for more players <span className="dot" id="dot1">.</span><span className="dot" id="dot2">.</span><span className="dot" id="dot3">.</span></p>
      </div>
    </div>
  );
};

export default PokerGame;
