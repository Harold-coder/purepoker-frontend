import React from 'react';
import './RightSidebar.css';

const RightSidebar = () => {
    return (
        <aside className="right-sidebar">
            <div className="search-tweets">
                <input type="text" placeholder="Search tweets..." className="search-input"/>
            </div>
            <div className="most-liked-tweets">
                <h3>Most Liked Tweets</h3>
                {/* Fetch and list the most liked tweets here */}
            </div>
        </aside>
    );
};

export default RightSidebar;
