import React, { useState } from 'react';
import './PokerGamePage.css'; // Importing CSS stylesheet

const PokerGamePage = () => {
    const [gameId, setGameId] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [minPlayers, setMinPlayers] = useState('');
    const [maxPlayers, setMaxPlayers] = useState('');
    const [buyIn, setBuyIn] = useState('');

    const handleJoinGame = () => {
        console.log(`Joining game with ID: ${gameId}`);
        // Add API call logic here
    };

    const handleCreateGame = () => {
        console.log(`Creating game with minPlayers: ${minPlayers}, maxPlayers: ${maxPlayers}, buyIn: ${buyIn}`);
        // Add API call logic here
    };

    return (
        <div className="pokerGamePage">
            <h1 className="pageTitle">Pure Poker</h1>     {/* TODO: MAKE THIS SHIT LEAD TO THE COMMUNITY PAGE */}              
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

export default PokerGamePage;
