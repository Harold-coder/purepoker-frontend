import React, { useState, useEffect } from 'react';
import './RightSidebar.css';

const RightSidebar = ({ onSearch, posts, onClose, onSelectPost }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [mostLikedPosts, setMostLikedPosts] = useState([]);

    useEffect(() => {
        // Sort the posts by likes and take the top N posts
        const sortedPosts = [...posts].sort((a, b) => b.likes - a.likes);
        setMostLikedPosts(sortedPosts.slice(0, 5)); // Adjust the number as needed
    }, [posts]);

    const handleSearchChange = (event) => {
        onClose();
        setSearchTerm(event.target.value);
        onSearch(event.target.value);  // Trigger search
    };

    const handlePostSelect = (postId) => {
        onSelectPost(postId);
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
                <ul>
                    {mostLikedPosts.map(post => (
                        <li key={post.id} onClick={() => handlePostSelect(post.id)}>
                            <span>{post.author}: </span>
                            <span>{post.likes} likes</span>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default RightSidebar;
