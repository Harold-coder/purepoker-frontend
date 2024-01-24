import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './RightSidebar.css';

const RightSidebar = ({ onSearch, posts }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [mostLikedPosts, setMostLikedPosts] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const sortedPosts = [...posts].sort((a, b) => b.likes - a.likes);
        setMostLikedPosts(sortedPosts.slice(0, 5));
    }, [posts]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        onSearch(event.target.value);
    };

    const handlePostSelect = (postId) => {
        navigate(`/post/${postId}`); // Navigate to the selected post
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
