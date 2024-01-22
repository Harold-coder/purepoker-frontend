import React from 'react';
import './DetailedPostView.css'; // Importing the specific CSS file for this component

const DetailedPostView = ({ post, onClose, comments }) => {
    return (
        <div className="detailed-post-view">
            <div className="navigation-back">
                <i className="fas fa-arrow-left" onClick={onClose}></i>
                <span>Post</span>
            </div>
            <div className="post-content">
                <h3>{post.author}</h3>
                <p>{post.content}</p>
                {/* Additional post details can go here */}
            </div>
            <div className="comments-section">
                {/* Mock comments display */}
                {comments.map((comment, index) => (
                    <div key={index} className="comment">
                        <p><strong>{comment.author}</strong>: {comment.content}</p>
                    </div>
                ))}
                {/* Comment submission area */}
                <div className="comment-submission">
                    <input type="text" placeholder="Write a comment..." />
                    <button>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default DetailedPostView;
