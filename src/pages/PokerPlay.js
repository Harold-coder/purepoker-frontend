// PokerPlay.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWebSocket } from '../context/PokerWebSocketContext';
import './PokerPlay.css';

const PokerPlay = () => {
    const { gameId } = useParams();
    const { gameState, sendPlayerAction } = useWebSocket();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (gameState) {
            setIsLoading(false);
        }
    }, [gameState]);

    if (isLoading) {
        return <div>Loading game...</div>;
    }

    const handleAction = (action, payload) => {
        sendPlayerAction(action, payload);
    };

    return (
        <div className="pokerPlay">
            <h2>Game ID: {gameId}</h2>
            <div className="table">
                {/* Display community cards */}
                <div className="communityCards">
                    {gameState.communityCards.map((card, index) => (
                        <div key={index} className="card">{card}</div>
                    ))}
                </div>
                {/* Display pot */}
                <div className="pot">Pot: {gameState.pot}</div>
                {/* Display players */}
                <div className="players">
                    {gameState.players.map((player, index) => (
                        <div key={index} className="player">
                            <div>{player.name}</div>
                            <div>Chips: {player.chips}</div>
                            {player.hand.map((card, idx) => (
                                <div key={idx} className="card">{card}</div>
                            ))}
                        </div>
                    ))}
                </div>
                {/* Player actions */}
                <div className="actions">
                    <button onClick={() => handleAction('fold')}>Fold</button>
                    <button onClick={() => handleAction('check')}>Check</button>
                    <button onClick={() => handleAction('call')}>Call</button>
                    <button onClick={() => handleAction('raise', {amount: 100})}>Raise</button>
                </div>
            </div>
        </div>
    );
};

export default PokerPlay;
