import React from 'react';
import { Link } from 'react-router-dom';
import './NavigationMenu.css'; // Importing the specific CSS file for this component

const NavigationMenu = () => {
    return (
        <nav className="navigation-menu">
            <ul className="navigation-list">
                <li className="navigation-item">
                    <Link to="/" className="navigation-link">Community</Link>
                </li>
                <li className="navigation-item">
                    <Link to="/groups" className="navigation-link">Groups</Link>
                </li>
                <li className="navigation-item">
                    <Link to="/profile" className="navigation-link">Profile</Link>
                </li>
                <li className="navigation-item">
                    <Link to="/poker-game" className="navigation-link">Poker Game</Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavigationMenu;
