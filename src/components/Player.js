import React, { useState, useEffect } from 'react';

const getSuitClass = (card) => {
    if (card.includes('♥')) return 'hearts';
    if (card.includes('♦')) return 'diamonds';
    if (card.includes('♠')) return 'spades';
    if (card.includes('♣')) return 'clubs';
};

const Player = ({ player, position, isCurrentTurn, currentPlayerId, canCall, canCheck, affordMinRaise, affordCall, minRaiseAmount, gameStage, highestBet, hasFolded,smallBlindIndex, playerCount, isReady, winners, handDescription, bestHand, handleCall, handleCheck, handleRaise, handleFold}) => {
    const isCurrentPlayer = (player.id === currentPlayerId);
    const [raiseValue, setRaiseValue] = useState(minRaiseAmount); // Initial raise amount
    const maxRaiseValue = player.chips - (highestBet - player.bet);
    const isWinner = winners.includes(player.id);
    const btnIdx = (smallBlindIndex + playerCount - 1) % playerCount;
    const bigBlindIndex = (smallBlindIndex + 1) % playerCount;
    const isSmallBlind = player.position === smallBlindIndex;
    const isBigBlind = player.position === bigBlindIndex;
    const isBtn = player.position === btnIdx
    const onCheck = () => {
        handleCheck(player.id);
    };
    const onCall = () => {
        handleCall(player.id);
    };
    const onRaise = (amount) => {
        handleRaise(amount);
    };
    const onRaiseAllIn = () => {
        handleRaise(player.id, maxRaiseValue);
    };
    const onFold = () => {
        handleFold(player.id);
    };
    const handleReady = () => {
        handleFold(player.id); //TODO
    };
    const cardClass = isCurrentPlayer ? "current-player-card" : "other-player-card";

    const onRaiseChange = (event) => {
        setRaiseValue(Number(event.target.value));
    };

    useEffect(() => {
        setRaiseValue(minRaiseAmount);
    }, [minRaiseAmount]);

    const currentPlayerStyle = {
        border: (gameStage !== 'gameOver' && isCurrentTurn) ? '2px solid black' : '1px solid gray',
        padding: '15px',
        borderRadius: '10px',
        backgroundColor: isWinner ? '#d4af37' : (hasFolded ? 'lightgray' : ''),
        opacity: 1,
        position: 'absolute',
        left: position.left,
        width: '375px', 
        height: 'auto',
        zIndex: 2,
        top: position.top,
        transform: 'translate(-50%, -50%)'
    };

    const otherPlayerStyle = {
        border: (gameStage !== 'gameOver' && isCurrentTurn) ? '2px solid black' : '1px solid gray',
        padding: '5px',
        borderRadius: '5px',
        backgroundColor: hasFolded ? 'lightgray' : (isWinner ? '#d4af37' : ''),
        opacity: 1,
        position: 'absolute',
        left: position.left,
        width: gameStage === 'gameOver' ? '200px' : '150px', // Adjust width based on gameStage
        minHeight: '100px', // Set a minimum height
        height: 'auto',
        zIndex: 1,
        top: position.top,
        transform: 'translate(-50%, -50%)',
        overflow: 'hidden', // Add overflow property if needed
        whiteSpace: 'nowrap', // Keep content on a single line until there's no more space
    };

    const playerStyle = isCurrentPlayer ? currentPlayerStyle : otherPlayerStyle;

    const labelStyle = {
        fontWeight: 'bold',
        backgroundColor: '#f0ad4e',
        color: '#fff',
        padding: '3px 6px',
        borderRadius: '8px',
        fontSize: '12px',
        alignSelf: 'center',
    };

    const winningHandStyle = {
        fontWeight: isWinner? 'bold': 'normal',
        fontSize: '16px',
        textAlign: 'center',
        color: isWinner? '#800080': '#000000'
    };
    
    const allInStyle = {
        color: 'blue',
        fontWeight: 'bold',
    };

    const readyButtonContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '10px',
    };

    const foldStyle = {
        position: 'absolute',
        top: 0,
        right: 0,
        fontSize: '24px',
        color: 'red',
        fontWeight: 'bold',
        padding: '5px'
    };

    return (
        <div className={`player ${isCurrentTurn ? 'current-turn' : ''}`} style={playerStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div>
                <h3 style={{ margin: '0', color: 'black', display: 'flex', alignItems: 'center' }}>
                    <div style={{ marginRight: '10px' }}> {/* This div wraps the labels */}
                        {isSmallBlind && <span style={labelStyle}>SB</span>}
                        {isBigBlind && <span style={labelStyle}>BB</span>}
                        {isBtn && <span style={labelStyle}>BTN</span>}
                    </div>
                    <span style={{ padding: '3px 8px', marginLeft: isSmallBlind || isBigBlind || isBtn ? '10px' : '0' }}>
                        {player.id}
                    </span>
                </h3>
                    <p style={{ margin: '0' }}>Chips: {player.chips}</p>
                    {gameStage !== 'gameOver' && (
                       <p style={{ margin: '0' }}>Bet: {player.bet}</p>
                    )}
                    {isCurrentPlayer && (
                        <p style={{ margin: '0' }}>Pot Contribution: {player.potContribution}</p>
                    )}
                    {gameStage === 'gameOver' && isCurrentPlayer && (
                        <>
                            <p style={{ margin: '0' }}>Amount Won: {player.amountWon}</p>
                            <p style={{ margin: '0' }}>Amount Gained: {player.amountWon - player.potContribution}</p>
                        </>
                    )}
                </div>
                { (isCurrentPlayer || (gameStage === 'gameOver' && !hasFolded)) && (
                    <div className="player-hand" style={{ display: 'flex', overflowX: 'auto' }}>
                        {player.hand.map((card, index) => {
                            const suitClass = getSuitClass(card);
                            const number = card.slice(0, -1).replace('T', '10');
                            return (
                                <div key={index} className={`card ${cardClass} ${suitClass}`}>
                                    <span>{number}</span> {/* Display the card number */}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            {player.isAllIn && <div style={allInStyle}>All-In</div>}
            {hasFolded && <span style={foldStyle}>X</span>}
            {gameStage !== 'gameOver' && isCurrentTurn && !hasFolded && isCurrentPlayer && (
        <div className="action-container">
            {canCheck && <button onClick={onCheck}>Check</button>}
            {canCall && (
                <button onClick={onCall}>{affordCall ? 'Call' : 'Call to All-In'}</button>
            )}
            {affordMinRaise && (
                <>
                    <input
                        type="range"
                        value={raiseValue}
                        onChange={onRaiseChange}
                        min={minRaiseAmount}
                        max={maxRaiseValue}
                        step="1"
                        className="raise-slider"
                    />
                    <output>{raiseValue}</output>
                    <button onClick={() => onRaise(raiseValue)}>Raise</button>
                </>
            )}
            {!affordMinRaise && affordCall && (
                <button onClick={onRaiseAllIn}>Raise to All-In</button>
            )}
            <button onClick={onFold}>Fold</button>
        </div>
    )}
            {gameStage === 'gameOver'  && !hasFolded && bestHand && (
                <>
                    {handDescription && (
                        <div style={winningHandStyle}>
                            {handDescription}
                        </div>
                    )}
                    {bestHand && (
                        <div style={winningHandStyle}>
                            {bestHand.join(', ')}
                        </div>
                    )}
                </>
            )}
            {gameStage === 'gameOver' && isCurrentPlayer && (
                <div style={readyButtonContainerStyle}> {/* Use the container style here */}
                    <button
                        className={`ready-button ${isReady ? 'button-pressed' : ''}`}
                        onClick={handleReady}
                        disabled={isReady}
                        style={{ width: 'auto', padding: '5px 10px' }} // Adjust button width and padding as needed
                    >
                        Ready for Next Game
                    </button>
                </div>
            )}
        </div>
    );
};

export default Player;