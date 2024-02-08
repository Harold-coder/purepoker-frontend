import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import "./ProfilePage.css";

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    // const user = {
    //     username: "debug local",
    //     email: "test local"
    // }

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className='profile-page-container'>
            <div className='header'>
                <p className='profile-title' onClick={() => navigate('/')}>Pure Poker</p>
                <button onClick={handleLogout} className="logout-button">
                    <FontAwesomeIcon icon={faSignOutAlt} size="2x" />
                </button>
            </div>
            <div className='profile-info'>
                <img src={require("../images/avatar.png")} className="profile-image" alt='avatar' />
                <p className='profile-info-text'><span className='info-label'>Username: </span>{user.username}</p>
                <p className='profile-info-text'><span className='info-label'>Email: </span>{user.email}</p>
                <p className='profile-info-text'><span className='info-label'>Profit Net Loss: </span><span className='pnl'>+$500</span></p>
            </div>
        </div>
    )
};

export default ProfilePage;
