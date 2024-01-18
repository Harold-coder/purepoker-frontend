import React from 'react';
import './PostsList.css';
import axios from 'axios';
import { urlServer } from '../App';

const PostsList = ( { posts, setPosts }) => {

    const handleLike = (post) => {
        const isLiked = post.liked;
        const updatedPost = { ...post, liked: !isLiked };
    
        axios.post(`${urlServer}/posts/${post.id}/like`, { like: !isLiked })
            .then(response => {
                setPosts(posts.map(p => p.id === post.id ? { ...updatedPost, likes: response.data.likes } : p));
            })
            .catch(error => console.error('Error updating like:', error));
    };

    return (
        <div className="posts-list">
            {posts.map(post => (
                <div key={post.id} className="post">
                <h3>{post.author}</h3>
                <p>{post.content}</p>
                <div className="post-interactions">
                    <span className="likes" onClick={() => handleLike(post)}>
                        <i className={post.liked ? "fas fa-heart liked" : "fas fa-heart"}></i> {post.likes}
                    </span>
                </div>
            </div>
            ))}
        </div>
    );
};

export default PostsList;
