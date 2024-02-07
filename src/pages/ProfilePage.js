import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "./ProfilePage.css";

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();  // Destructure logout from useAuth

    const navigateToCommunity = () => {
        navigate('/');
    };

    const handleLogout = async () => {
        await logout();  // Call the logout function from AuthProvider
        navigate('/login');  // Redirect to login page after logout
    };

    return (
        <div className='profile-page-container'>
            <p className='profile-title' onClick={navigateToCommunity}>Pure Poker</p>
            <div className='profile-info'>
                <img src={require("../images/avatar.png")} className="profile-image" alt='avatar'></img>
                <p className='profile-info-text'><span className='info-label'>Username: </span>{user.username}</p>
                <p className='profile-info-text'><span className='info-label'>Email: </span>{user.email}</p> {/* Use user.email */}
                <p className='profile-info-text'><span className='info-label'>Profit Net Loss: </span><span className='pnl'>+$500</span></p>
                <button onClick={handleLogout} className="logout-button">Logout</button> {/* Add Logout Button */}
            </div>
        </div>
    )
};

export default ProfilePage;
