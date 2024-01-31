// Post.js
import React from 'react';
import moment from 'moment';
import './Post.css'; // Ensure to create and import the CSS for styling

const Post = ({ data, isComment, onLike, onDelete, onPostClick }) => {
    const formatDate = (utcDateString) => {
        const localDate = moment.utc(utcDateString).local();
        const now = moment();
        if (now.diff(localDate, 'hours') < 24) {
            return localDate.fromNow();  // Correctly uses the local time
        }
        return localDate.format('MMMM Do YYYY');  // e.g., 'January 3rd 2021'
    };

    const handleLikeClick = (e) => {
        e.stopPropagation();
        onLike(e, data); // Pass both event and data
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation(); // Prevents the post click when deleting
        onDelete(data.id);
    };

    return (
        <div className={`post ${isComment ? 'comment' : ''}`} onClick={() => !isComment && onPostClick(data.id)}>
            <div className="post-header">
                <div className="author-and-date">
                    <h3>{data.author}</h3>
                    <span className="post-date">{formatDate(data.created_at)}</span>
                </div>
                <span className="delete-icon" onClick={handleDeleteClick}>
                    <i className="fas fa-trash-alt"></i>
                </span>
            </div>
            <div className="post-content">
                {data.content}
            </div>
            <div className="post-interactions">
                <span className="likes" onClick={handleLikeClick}>
                    <i className={data.liked ? "fas fa-heart liked" : "fas fa-heart"}></i> {data.likes}
                </span>
                {!isComment && (
                    <span className="comments">
                        <i className="fas fa-comments"></i> {data.commentsCount || 0}
                    </span>
                )}
            </div>
        </div>
    );
};

export default Post;
