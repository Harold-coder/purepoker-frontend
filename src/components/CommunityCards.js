import React from 'react';
import './CommunityCards.css';

const getSuitClass = (card) => {
    if (card.endsWith('♥')) return 'hearts';
    if (card.endsWith('♦')) return 'diamonds';
    if (card.endsWith('♠')) return 'spades';
    if (card.endsWith('♣')) return 'clubs';
};

const CommunityCards = ({ cards }) => {
    return (
        <div className="community-cards">
            {cards.map((card, index) => {
                const number = card.slice(0, -1).replace('T', '10');
                const suitClass = getSuitClass(card);
                return (
                    <div key={index} className={`card community-card ${suitClass}`}>
                        <div>{number}</div>
                        {/* No need for a separate div for the suit symbol if your CSS adds it based on the class */}
                    </div>
                );
            })}
        </div>
    );
};

export default CommunityCards;
