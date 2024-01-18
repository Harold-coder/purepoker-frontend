import React, { useState } from 'react';
import './RightSidebar.css';

const RightSidebar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        onSearch(event.target.value);  // Trigger search
    };

    return (
        <aside className="right-sidebar">
            <div className="search-posts">
                <input 
                    type="text" 
                    placeholder="Search posts..." 
                    className="search-input"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="most-liked-posts">
                <h3>Most Liked Posts</h3>
                {/* Fetch and list the most liked posts here */}
            </div>
        </aside>
    );
};

export default RightSidebar;
