// PokerPlay.js
import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../context/PokerWebSocketContext'; // Adjust the path as needed
import Player from '../components/Player';
import Pot from '../components/Pot';
import { useAuth } from '../context/AuthContext';
import CommunityCards from '../components/CommunityCards';
import './PokerPlay.css'; 

const PokerPlayer = () => {
    const [playerPositions, setPlayerPositions] = useState([]);
    const tableRef = useRef(null);
    const { user } = useAuth();
    const currentPlayerId = user.username;

    const { gameState, sendPlayerAction } = useWebSocket(); // Use gameState and sendPlayerAction from context

    useEffect(() => {
        const updatePositions = () => {
            if (gameState && gameState.players.length > 0 && tableRef.current) {
                const { width, height } = tableRef.current.getBoundingClientRect();
                const newPositions = calculatePlayerPositions(gameState.players, width / 2, height / 2, width / 2, height / 2, gameState.players.find(player => player.id === currentPlayerId).position);
                setPlayerPositions(newPositions);
            }
        };

        updatePositions(); // Initial call to set player positions
        window.addEventListener('resize', updatePositions); // Update positions on window resize
        return () => window.removeEventListener('resize', updatePositions); // Cleanup on component unmount
    }, [gameState, currentPlayerId]);

    const handleCall = (playerId) => {
        // Assuming 'gameState' has a property 'gameId' that identifies the current game
        sendPlayerAction('playerCall', { gameId: gameState.gameId, playerId });
    };
    
    const handleCheck = (playerId) => {
        // Send a 'playerCheck' action; adjust the action name if your backend expects something different
        sendPlayerAction('playerCheck', { gameId: gameState.gameId, playerId });
    };
    
    const handleRaise = (playerId, amount) => {
        console.log(amount);
        // 'amount' parameter should be the raise amount specified by the player
        sendPlayerAction('playerRaise', { gameId: gameState.gameId, playerId, raiseAmount: amount });
    };
    
    const handleFold = (playerId) => {
        // Send a 'playerFold' action; adjust the action name if your backend expects something different
        sendPlayerAction('playerFold', { gameId: gameState.gameId, playerId });
    };

    const handleReady = (playerId) => {
        // Send a 'playerFold' action; adjust the action name if your backend expects something different
        sendPlayerAction('playerReady', { gameId: gameState.gameId, playerId });
    };

    return (
        <div className="poker-player">
            <div className="poker-table" ref={tableRef}>
                {gameState.players.map((player, index) => (
                    <Player
                        key={index}
                        player={player}
                        currentPlayerId={currentPlayerId}
                        isCurrentTurn={gameState.currentTurn === player.position}
                        position={playerPositions[index] || { left: 0, top: 0 }}
                        sendPlayerAction={sendPlayerAction}
                        canCheck={gameState.currentTurn === player.position && player.bet === gameState.highestBet}
                        canCall={player.position === gameState.currentTurn && gameState.highestBet > player.bet && gameState.bettingStarted}
                        affordMinRaise={player.position === gameState.currentTurn && (player.chips + player.bet - gameState.highestBet) > gameState.minRaiseAmount}
                        affordCall={player.position === gameState.currentTurn && player.chips + player.bet > gameState.highestBet}
                        minRaiseAmount= {gameState.minRaiseAmount}
                        gameStage = {gameState.gameStage}
                        highestBet = {gameState.highestBet}
                        hasFolded = {!player.inHand}
                        smallBlindIndex = {gameState.smallBlindIndex}
                        playerCount = {gameState.playerCount}
                        isReady = {player.isReady}
                        winners = {gameState.netWinners}
                        handDescription = {player.handDescription}
                        bestHand = {player.bestHand}
                        handleCall={() => handleCall(player.id)}
                        handleCheck={() => handleCheck(player.id)}
                        handleRaise={(amount) => handleRaise(player.id, amount)}
                        handleFold={() => handleFold(player.id)}
                        handleReady={() => handleReady(player.id)}
                    />
                ))}
                <div className="community-cards-area">
                    <CommunityCards cards={gameState.communityCards} />
                    <Pot pot={gameState.pot} />
                </div>
            </div>
        </div>
    );
};

const calculatePlayerPositions = (players, centerX, centerY, ovalWidth, ovalHeight, currentPlayerIndex) => {
    const playerCount = players.length;
  
    return players.map((_, index) => {
      // Calculate the angle for this player's position in the circle
      let angle = (2 * Math.PI / playerCount) * (index - currentPlayerIndex);
      // Adjust angles to ensure the current player is at the bottom
      angle += Math.PI / 2; // Rotate by 90 degrees so the bottom position is 0 degrees
  
      // Ensure the angle is within the range [0, 2π]
      if (angle < 0) {
        angle += 2 * Math.PI;
      }
  
      // Calculate the x and y positions based on the angle
      const x = Math.cos(angle) * ovalWidth;
      const y = Math.sin(angle) * ovalHeight;
  
      // Adjust the positions to be relative to the center point
      return {
        left: centerX + x, // Now returns a number
        top: centerY + y -200, // Now returns a number
      };
    });
};



export default PokerPlayer;