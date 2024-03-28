import React, { useState, useEffect } from 'react';
import { websocketService } from '../../context/PokerWebsocketService'; // Adjust the path as needed
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../../context/PokerWebSocketContext'; // Import the context
import Loading from '../../components/Loading';
import './PokerLobby.css'; // Importing CSS stylesheet

const PokerLobby = () => {
    const [gameId, setGameId] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [minPlayers, setMinPlayers] = useState('');
    const [maxPlayers, setMaxPlayers] = useState('');
    const [bigBlind, setBigBlind] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const { gameState, errorMessage, setErrorMessage } = useWebSocket(); // Use gameState from context

    const { user } = useAuth();

    useEffect(() => {
        // No need to do anything
    }, [gameState, navigate]);

    const handleJoinGame = () => {
        setErrorMessage('');
        console.log(`Joining game with ID: ${gameId}`);
        websocketService.sendMessage("joinGame", { gameId, playerId: user.username }); 
        setLoading(true);
    };

    const handleCreateGame = () => {
        setErrorMessage('');
        console.log(`Creating game with minPlayers: ${minPlayers}, maxPlayers: ${maxPlayers}, bigBlind: ${bigBlind}`);

        websocketService.sendMessage("createGame", { minNumberOfPlayers: minPlayers, maxNumberOfPlayers: maxPlayers, bigBlind, playerId: user.username }); // Adjust `playerId` as needed
        setLoading(true);
    };

    useEffect(() => {
        setLoading(false);
    }, [errorMessage]);

    // Function to navigate home
    const navigateHome = () => navigate('/');

    return (
        <div className="PokerLobby">
            <button className="homeButton" onClick={navigateHome} title="Go to home">
                <i className="fas fa-home"></i>
            </button>
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
                {!loading && <p className="or-text">or</p>}
                {loading && <Loading />}
                {!loading && 
                    <div className="createGameSection">
                        <button className="toggleFormButton" onClick={() => setShowCreateForm(!showCreateForm)}>Create New <br></br> Game</button>
                        {showCreateForm && (
                            <div className="createForm">
                                <input
                                    className="formInput"
                                    type="number"
                                    placeholder="Minimum Players"
                                    value={minPlayers}
                                    onChange={(e) => setMinPlayers(Number(Number(e.target.value)))}
                                />
                                <input
                                    className="formInput"
                                    type="number"
                                    placeholder="Maximum Players"
                                    value={maxPlayers}
                                    onChange={(e) => setMaxPlayers(Number(Number(e.target.value)))}
                                />
                                <input
                                    className="formInput"
                                    type="number"
                                    placeholder="Big Blind"
                                    value={bigBlind}
                                    onChange={(e) => setBigBlind(Number(e.target.value))}
                                />
                                <button className="submitButton" onClick={handleCreateGame}>Create</button>
                            </div>
                        )}
                    </div>
                }
                {<p className='errorMessage'>{errorMessage}</p>}
            </div>
        </div>
    );
};

export default PokerLobby;
