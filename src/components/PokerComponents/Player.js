import React, { useState, useEffect } from 'react';
import './Player.css';

const getSuitClass = (card) => {
    if (card.includes('♥')) return 'hearts';
    if (card.includes('♦')) return 'diamonds';
    if (card.includes('♠')) return 'spades';
    if (card.includes('♣')) return 'clubs';
};

const Player = ({ player, position, isCurrentTurn, currentPlayerId, canCall, canCheck, affordMinRaise, affordCall, minRaiseAmount, gameStage, highestBet, hasFolded,smallBlindIndex, playerCount, isReady, winners, handDescription, bestHand, handleCall, handleCheck, handleRaise, handleFold, handleReady}) => {
    const isCurrentPlayer = (player.id === currentPlayerId);
    const isWaiting = player.isWaiting === true;
    const [raiseValue, setRaiseValue] = useState(minRaiseAmount); // Initial raise amount
    const maxRaiseValue = player.chips - (highestBet - player.bet);
    const isWinner = winners.includes(player.id);
    const btnIdx = (smallBlindIndex + playerCount - 1) % playerCount;
    const bigBlindIndex = (smallBlindIndex + 1) % playerCount;
    
    const isSmallBlind = playerCount > 2 && player.position === smallBlindIndex;
    const isBigBlind = playerCount > 2 && player.position === bigBlindIndex;
    const isBtn = playerCount > 2 && player.position === btnIdx;

    const isEmpty = position.isEmpty; //TODO: change to a better check lol

    const [sliderBackground, setSliderBackground] = useState('');

    // Update the slider background based on its value
    useEffect(() => {
        const percentage = ((raiseValue - minRaiseAmount) / (maxRaiseValue - minRaiseAmount)) * 100;
        setSliderBackground(`linear-gradient(90deg, rgb(111, 12, 12) ${percentage}%, rgb(233,233,233) ${percentage}%)`);
    }, [raiseValue, minRaiseAmount, maxRaiseValue]);

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
        <>
        {!isEmpty && !isWaiting &&
        <div className={`player ${isCurrentTurn ? 'current-turn' : ''} ${hasFolded ? 'has-folded' : ''} ${gameStage === 'gameOver' ? 'game-over' : ''} ${isWinner ? 'is-winner' : ''} ${isCurrentPlayer ? 'current-player' : 'other-player'}`} style={{ position: 'absolute', left: `${position.left}px`, top: `${position.top}px` }}>
            <div className = 'info-container'>
                { isCurrentPlayer && (
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
                {/* Nobody folded, we need to reveal everyone's cards: */}
                { !isCurrentPlayer && (gameStage === 'gameOver' && handDescription) && (
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
                {/* Game is done,  everyone folded but one person, no need to show the cards: */}
                { (!isCurrentPlayer && (gameStage === 'gameOver' && !handDescription && !hasFolded)) && (
                    <div className="player-hand">
                        {player.hand.map((card, index) => {
                            return (
                                <div key={index} className={`card card-back`}>
                                    {/* Don't need anything */}
                                </div>
                            );
                        })}
                    </div>
                )}
                {/* Game is going on and is not the player, we show the back of the cards: */}
                { (!isCurrentPlayer && (gameStage !== 'gameOver' && !hasFolded)) && (
                    <div className="player-hand">
                        {player.hand.map((card, index) => {
                            return (
                                <div key={index} className={`card card-back`}>
                                    {/* Don't need anything */}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <div className='id-container'>
                <div className='labels'>
                    {isSmallBlind && <span className='btn-style'>SB</span>}
                    {isBigBlind && <span className='btn-style'>BB</span>}
                    {isBtn && <span className='btn-style'>BTN</span>}
                </div>
                <p className='labels'>
                    <span className={`player-id ${isSmallBlind || isBigBlind || isBtn ? 'show-label' : ''} ${isCurrentPlayer ? 'current-player-id' : ''}`}>
                        {player.id}
                    </span>
                </p>
                    {!isEmpty && <p className='margin-zero chips-count'>{player.chips}</p>}
                </div>
            {player.isAllIn && <div className='all-in'>All-In</div>}
            {/* Cases: */}
            {/* 1. We show the cards */}
            {gameStage === 'gameOver'  && !hasFolded && handDescription && (
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
            {/* 2. Everyone folded but one. We can see this because there is no handDescription */}

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
        }
        {isEmpty && 
            <div key={`empty-seat-${position.index}`} className="empty-seat" style={{ left: `${position.left}px`, top: `${position.top}px` }}>
            Empty Seat
            </div>
        }
        {!isEmpty && isWaiting &&
            <div className="waiting-seat" style={{ left: `${position.left}px`, top: `${position.top}px` }}>
                {player.id}
            </div>
        }
        {!isEmpty && !isWaiting && gameStage !== 'gameOver' && isCurrentTurn && !hasFolded && isCurrentPlayer && (
                <div className="action-container" style={{position: 'absolute', left: '50%', top: '110%'} }>
                    {canCheck && <button className='action-button' onClick={onCheck}>Check</button>}
                    {canCall && (
                        <button className='action-button' onClick={onCall}>{affordCall ? 'Call' : 'Call to All-In'}</button>
                    )}
                    {!showSlider && <button className='action-button' onClick={onFold}>Fold</button>}
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
                                style={{ background: sliderBackground }}
                                />
                                <output className='raise-value'>{raiseValue}</output>
                                <button className='action-button back-btn' onClick={() => setShowSlider(false)}>Back</button>
                                <button className='action-button' onClick={() => onRaise(raiseValue)}>Raise</button>
                            </>
                        }
                        {!showSlider &&
                            <>
                                <button className='action-button' onClick={() => setShowSlider(true)}>Raise</button>
                            </>
                        }
                        </>
                    )}
                    {!affordMinRaise && affordCall && (
                        <button className='action-button' onClick={onRaiseAllIn}>Raise to All-In</button>
                    )}
                </div>
            )
        }

        </>
    );
};

export default Player;