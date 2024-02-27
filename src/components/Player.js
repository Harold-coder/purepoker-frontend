import React, { useState, useEffect } from 'react';
import './Player.css';

const getSuitClass = (card) => {
    if (card.includes('♥')) return 'hearts';
    if (card.includes('♦')) return 'diamonds';
    if (card.includes('♠')) return 'spades';
    if (card.includes('♣')) return 'clubs';
};

const Player = ({ player, position, isCurrentTurn, currentPlayerId, canCall, canCheck, affordMinRaise, affordCall, minRaiseAmount, gameStage, highestBet, hasFolded,smallBlindIndex, playerCount, isReady, winners, handDescription, bestHand, handleCall, handleCheck, handleRaise, handleFold, handleReady }) => {
    const isCurrentPlayer = (player.id === currentPlayerId);
    const [raiseValue, setRaiseValue] = useState(minRaiseAmount); // Initial raise amount
    const maxRaiseValue = player.chips - (highestBet - player.bet);
    const isWinner = winners.includes(player.id);
    const btnIdx = (smallBlindIndex + playerCount - 1) % playerCount;
    const bigBlindIndex = (smallBlindIndex + 1) % playerCount;
    const isSmallBlind = player.position === smallBlindIndex;
    const isBigBlind = player.position === bigBlindIndex;
    const isBtn = player.position === btnIdx;

    const [showSlider, setShowSlider] = useState(false);
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
        handleRaise(maxRaiseValue);
    };
    const onFold = () => {
        handleFold(player.id);
    };
    const onReady = () => {
        handleReady(player.id);
    };
    const cardClass = isCurrentPlayer ? "current-player-card" : "other-player-card";

    const onRaiseChange = (event) => {
        setRaiseValue(Number(event.target.value));
    };

    useEffect(() => {
        setRaiseValue(minRaiseAmount);
        setShowSlider(false);
    }, [minRaiseAmount]);

    return (
        <div className={`player ${isCurrentTurn ? 'current-turn' : ''} ${hasFolded ? 'has-folded' : ''} ${gameStage === 'gameOver' ? 'game-over' : ''} ${isWinner ? 'is-winner' : ''} ${isCurrentPlayer ? 'current-player' : 'other-player'}`} style={{ left: `${position.left}px`, top: `${position.top}px` }}>
            <div className = 'info-container'>
                <div>
                <h3 className='labels'>
                    <div>
                        {isSmallBlind && <span className='label-style'>SB</span>}
                        {isBigBlind && <span className='label-style'>BB</span>}
                        {isBtn && <span className='label-style'>BTN</span>}
                    </div>
                    <span className={`player-id ${isSmallBlind || isBigBlind || isBtn ? 'show-label' : ''}`}>
                        {player.id}
                    </span>
                </h3>
                    <p className='margin-zero'>Chips: {player.chips}</p>
                    {gameStage === 'gameOver' && isCurrentPlayer && (
                        <>
                            <p className='margin-zero'>Amount Won: {player.amountWon}</p>
                            <p className='margin-zero'>Amount Gained: {player.amountWon - player.potContribution}</p>
                        </>
                    )}
                </div>
                { (isCurrentPlayer || (gameStage === 'gameOver' && !hasFolded)) && (
                    <div className="player-hand">
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
                { (!isCurrentPlayer && (gameStage !== 'gameOver' && !hasFolded)) && (
                    <div className="player-hand">
                        {player.hand.map((card, index) => {
                            const suitClass = getSuitClass(card);
                            const number = card.slice(0, -1).replace('T', '10');
                            return (
                                <div key={index} className={`card`}>
                                    <span>??</span> {/* Display the card number */}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            {player.isAllIn && <div className='all-in'>All-In</div>}
            {hasFolded && <span className='fold-style'>X</span>}
            {gameStage !== 'gameOver' && isCurrentTurn && !hasFolded && isCurrentPlayer && (
                <div className="action-container">
                    {canCheck && <button onClick={onCheck}>Check</button>}
                    {canCall && !showSlider && (
                        <button onClick={onCall}>{affordCall ? 'Call' : 'Call to All-In'}</button>
                    )}
                    {!showSlider && <button onClick={onFold}>Fold</button>}
                    {affordMinRaise && (
                        <>
                        {showSlider && 
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
                        }
                        {!showSlider &&
                            <button onClick={() => setShowSlider(true)}>Raise</button>
                        }
                        </>
                    )}
                    {!affordMinRaise && affordCall && (
                        <button onClick={onRaiseAllIn}>Raise to All-In</button>
                    )}
                </div>
            )}
            {gameStage === 'gameOver'  && !hasFolded && bestHand && (
                <>
                    {handDescription && (
                        <div className={`winning-hand-style ${isWinner ? 'is-winner' : ''}`}>
                            {handDescription}
                        </div>
                    )}
                    {bestHand && (
                        <div className={`winning-hand-style ${isWinner ? 'is-winner' : ''}`}>
                            {bestHand.join(', ')}
                        </div>
                    )}
                </>
            )}
            {gameStage === 'gameOver' && isCurrentPlayer && (
                <div className='ready-button-container'> {/* Use the container style here */}
                    <button
                        className={`ready-button ${isReady ? 'button-pressed' : ''}`}
                        onClick={onReady}
                        disabled={isReady}
                    >
                        Ready for Next Game
                    </button>
                </div>
            )}
        </div>
    );
};

export default Player;