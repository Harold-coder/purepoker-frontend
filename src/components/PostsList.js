import React from 'react';
import './PostsList.css';
import axios from 'axios';
import { urlServer } from '../App';
import moment from 'moment';

const PostsList = ( { posts, setPosts }) => {

    const formatDate = (utcDateString) => {
        const localDate = moment.utc(utcDateString).local();
        const now = moment();
        if (now.diff(localDate, 'hours') < 24) {
            return localDate.fromNow();  // Correctly uses the local time
        }
        return localDate.format('MMMM Do YYYY');  // e.g., 'January 3rd 2021'
    };

    const handleLike = (post) => {
        const isLiked = post.liked;
        const updatedPost = { ...post, liked: !isLiked };
    
        axios.post(`${urlServer}/posts/${post.id}/like`, { like: !isLiked })
            .then(response => {
                setPosts(posts.map(p => p.id === post.id ? { ...updatedPost, likes: response.data.likes } : p));
            })
            .catch(error => console.error('Error updating like:', error));
    };

    const handleDelete = (postId) => {
        axios.delete(`${urlServer}/posts/${postId}`)
            .then(() => {
                // Filter out the deleted post
                const updatedPosts = posts.filter(post => post.id !== postId);
                setPosts(updatedPosts);
            })
            .catch(error => console.error('Error deleting post:', error));
    };

    return (
        <div className="posts-list">
            {posts.map(post => (
                <div key={post.id} className="post">
                <div className="post-header">
                    <div className="author-and-date">
                        <h3>{post.author}</h3>
                        <span className="post-date">{formatDate(post.created_at)}</span>
                    </div>
                    <span className="delete-icon" onClick={() => handleDelete(post.id)}>
                        <i className="fas fa-trash-alt"></i>
                    </span>
                </div>
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
