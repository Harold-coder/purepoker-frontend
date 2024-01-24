import React, { useState } from 'react';
import axios from 'axios';
import { urlServer } from '../App';
import './DetailedPostView.css'; // Importing the specific CSS file for this component
import moment from 'moment';

const DetailedPostView = ({ post, onClose, comments, setComments, likeComment, deleteComment }) => {
    const [newComment, setNewComment] = useState('');
    const [visibleCommentsCount, setVisibleCommentsCount] = useState(5); // Initially show 5 comments

    const formatDate = (utcDateString) => {
        const localDate = moment.utc(utcDateString).local();
        const now = moment();
        if (now.diff(localDate, 'hours') < 24) {
            return localDate.fromNow();  // Correctly uses the local time
        }
        return localDate.format('MMMM Do YYYY');  // e.g., 'January 3rd 2021'
    };

    const submitComment = () => {
        if (!newComment.trim()) {
            return; // Prevent empty comments
        }

        const commentToAdd = {
            // You can include an id if available from the response, or a temporary one
            id: Date.now(), 
            post_id: post.id,
            author: "TemporaryAuthor", // Replace with actual author data once authentication is implemented
            content: newComment,
            likes: 0,
            created_at: new Date().toISOString()
        };

        // Optimistically update the local state
        setComments([commentToAdd, ...comments]);

        axios.post(`${urlServer}/posts/${post.id}/comments`, { author: "TemporaryAuthor", content: newComment })
            .then(response => {
                setNewComment('');
                setComments([response.data, ...comments]); // Use data from the backend
            })
            .catch(error => console.error('Error posting comment:', error));
    };

    const handleLikeClick = (e, comment) => {
        e.stopPropagation(); // Prevent event from bubbling up to the comment element
        likeComment(comment.id);
    };

    const handleDeleteClick = (e, commentId) => {
        e.stopPropagation(); // Prevent event from bubbling up to the comment element
        deleteComment(commentId);
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent the default action to avoid line breaks in input
            submitComment();
        }
    };

    const loadMoreComments = () => {
        setVisibleCommentsCount(prevCount => prevCount + 5); // Load 5 more comments
    };

    return (
        <div className="detailed-post-view">
            <div className="navigation-back">
                <i className="fas fa-arrow-left" onClick={onClose}></i>
                <span>Post</span>
            </div>
            <div className="post-content">
                <h3>{post.author}</h3>
                <p>{post.content}</p>
            </div>
            <div className="post-info-banner">
                <span><i className="fas fa-calendar-alt"></i> {formatDate(post.created_at)}</span>
                <span><i className="fas fa-heart"></i> {post.likes} Like{post.likes !== 1 ? 's' : ''}</span>
                <span><i className="fas fa-comments"></i> {comments.length} Comment{comments.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="comment-submission">
                <input 
                    type="text" 
                    placeholder="Write a comment..." 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <button onClick={submitComment}>Submit</button>
            </div>
            <div className="comments-section">
                {comments.slice(0, visibleCommentsCount).map((comment) => (
                    <div key={comment.id} className="comment">
                        <div className="comment-header">
                            <div className="author-and-date">
                                <h3>{comment.author}</h3>
                                <span className="comment-date">{formatDate(comment.created_at)}</span>
                            </div>
                            <span className="delete-icon" onClick={(e) => handleDeleteClick(e, comment.id)}>
                                <i className="fas fa-trash-alt"></i>
                            </span>
                        </div>
                        <p className='comment-content'>{comment.content}</p>
                        <div className="comment-interactions">
                            <span className="likes" onClick={(e) => handleLikeClick(e, comment)}>
                                <i className={comment.liked ? "fas fa-heart liked" : "fas fa-heart"}></i> {comment.likes}
                            </span>
                        </div>
                    </div>
                ))}
                {visibleCommentsCount < comments.length && (
                    <button className="load-more-comments" onClick={loadMoreComments}>
                        Load More Comments
                    </button>
                )}
            </div>
        </div>
    );
};

export default DetailedPostView;
