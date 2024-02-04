// src/pages/ProfilePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./ProfilePage.css";

const ProfilePage = () => {
    const navigate = useNavigate();

    const navigateToCommunity = () => {
        navigate('/');
    };
    return (
        <div className='profile-page-container'>
            <p className='profile-title' onClick={navigateToCommunity}>Pure Poker</p>
            <div className='profile-info'>
                <img src={require("../images/avatar.png")} className="profile-image" alt='avatar'></img>
                <p className='profile-info-text'><span className='info-label'>Username: </span>Harold1415</p>
                <p className='profile-info-text'><span className='info-label'>Email: </span> haroldghini@gmail.com</p>
                <p className='profile-info-text'><span className='info-label'>Profit Net Loss: </span><span className='pnl'>+$500</span></p>
            </div>
        </div>
    )
};

export default ProfilePage;
