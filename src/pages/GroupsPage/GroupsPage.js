// src/pages/GroupsPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GroupsPage.css';

const GroupsPage = () => {
    const navigate = useNavigate();
    const groups = ['Group 1', 'Group 2', 'Group 3']; // Placeholder for groups

    const navigateToChat = () => {
        navigate('/chat'); // Navigate to the ChatPage
    };

    return (
        <div className="groups-page">
            <div className="groups-list">
                {groups.map((group, index) => (
                    <div key={index} className="group" onClick={navigateToChat}>
                        {group}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroupsPage;
