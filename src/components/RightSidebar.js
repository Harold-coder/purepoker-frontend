import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './RightSidebar.css';

const RightSidebar = ({ posts }) => {
    const [mostLikedPosts, setMostLikedPosts] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const sortedPosts = [...posts].sort((a, b) => b.likes - a.likes);
        setMostLikedPosts(sortedPosts.slice(0, 5));
    }, [posts]);

    const handlePostSelect = (postId) => {
        navigate(`/post/${postId}`); // Navigate to the selected post
    };

    return (
        <aside className="right-sidebar">
            <div className="most-liked-posts">
                <h3>Most Liked Posts</h3>
                <ul>
                    {mostLikedPosts.map(post => (
                        <li key={post.id} onClick={() => handlePostSelect(post.id)}>
                            <span className="author-icon"><i className="fas fa-user"></i></span>
                            <div className="post-info">
                                <span>{post.author}</span>
                                <span className="likes"><i className="fas fa-heart"></i> {post.likes}</span>
                            </div>
                            <p className="post-preview">{post.content.length > 50 ? post.content.substring(0, 50) + "..." : post.content}</p> {/* Show a preview of the post */}
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default RightSidebar;
