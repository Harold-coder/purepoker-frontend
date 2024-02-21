import React, { useState, useEffect } from 'react';
import { websocketService } from '../context/PokerWebsocketService'; // Adjust the path as needed
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './PokerLobby.css'; // Importing CSS stylesheet

const PokerLobby = () => {
    const [gameId, setGameId] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [minPlayers, setMinPlayers] = useState('');
    const [maxPlayers, setMaxPlayers] = useState('');
    const [buyIn, setBuyIn] = useState('');

    const navigate = useNavigate();

    const { user } = useAuth();

    useEffect(() => {
        // Set up the success callback
        websocketService.onGameCreateSuccess = (data) => {
            localStorage.setItem('gameId', data.gameDetails.gameId);
            navigate(`/poker-game/${data.gameDetails.gameId}`);
        };

        // Set up the error callback
        websocketService.onGameCreateError = (message) => {
            alert(message); // For simplicity, using an alert to show the error
        };
    }, [navigate]);

    const handleJoinGame = () => {
        console.log(`Joining game with ID: ${gameId}`);
        websocketService.sendMessage("joinGame", { gameId, playerUsername: user.username }); // Adjust `playerUsername` as needed
    };

    const handleCreateGame = () => {
        console.log(`Creating game with minPlayers: ${minPlayers}, maxPlayers: ${maxPlayers}, buyIn: ${buyIn}`);
        websocketService.sendMessage("createGame", { minNumberOfPlayers: minPlayers, maxNumberOfPlayers: maxPlayers, buyIn, playerId: user.username }); // Adjust `playerId` as needed
    };

    return (
        <div className="PokerLobby">
            {/* TODO: Add a home icon that leads to the community page. */}   
            <h1 className="pageTitle">Pure Poker</h1>           
            <div className="inputGameInfoSection">
                <div className="joinGameSection">
                    <input
                        className="gameInput"
                        type="text"
                        placeholder="Enter Game ID"
                        value={gameId}
                        onChange={(e) => setGameId(e.target.value)}
                    />
                    <button className="actionButton" onClick={handleJoinGame}>Join Game</button>
                </div>
                <p className="or-text">or</p>
                <div className="createGameSection">
                    <button className="toggleFormButton" onClick={() => setShowCreateForm(!showCreateForm)}>Create New Game</button>
                    {showCreateForm && (
                        <div className="createForm">
                            <input
                                className="formInput"
                                type="number"
                                placeholder="Minimum Players"
                                value={minPlayers}
                                onChange={(e) => setMinPlayers(e.target.value)}
                            />
                            <input
                                className="formInput"
                                type="number"
                                placeholder="Maximum Players"
                                value={maxPlayers}
                                onChange={(e) => setMaxPlayers(e.target.value)}
                            />
                            <input
                                className="formInput"
                                type="number"
                                placeholder="Buy-In"
                                value={buyIn}
                                onChange={(e) => setBuyIn(e.target.value)}
                            />
                            <button className="submitButton" onClick={handleCreateGame}>Create</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PokerLobby;
