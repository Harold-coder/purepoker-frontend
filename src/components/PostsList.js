import React from 'react';
import './PostsList.css';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const PostsList = ( { posts, onLike, onDelete, onPostClick }) => {
    const navigate = useNavigate();

    const formatDate = (utcDateString) => {
        const localDate = moment.utc(utcDateString).local();
        const now = moment();
        if (now.diff(localDate, 'hours') < 24) {
            return localDate.fromNow();  // Correctly uses the local time
        }
        return localDate.format('MMMM Do YYYY');  // e.g., 'January 3rd 2021'
    };

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`); // Navigate to the detailed view of the post
    };

    const handleLikeClick = (e, post) => {
        e.stopPropagation(); // Stop click event from bubbling up to the parent
        onLike(post);
    };

    const handleDeleteClick = (e, postId) => {
        e.stopPropagation(); // Stop click event from bubbling up to the parent
        onDelete(postId);
    };

    return (
        <div className="posts-list">
            {posts.map(post => (
                <div key={post.id} className="post" onClick={() => handlePostClick(post.id)}>
                    <div className="post-header">
                        <div className="author-and-date">
                            <h3>{post.author}</h3>
                            <span className="post-date">{formatDate(post.created_at)}</span>
                        </div>
                        <span className="delete-icon" onClick={(e) => handleDeleteClick(e, post.id)}>
                            <i className="fas fa-trash-alt"></i>
                        </span>
                    </div>
                    <p>{post.content}</p>
                    <div className="post-interactions">
                        <span className="likes" onClick={(e) => handleLikeClick(e, post)}>
                            <i className={post.liked ? "fas fa-heart liked" : "fas fa-heart"}></i> {post.likes}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PostsList;
