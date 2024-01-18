import React from 'react';
import "./PostComposer.css";

const PostComposer = () => {
    return (
        <div className="post-composer">
            <textarea placeholder="What's on your mind?" className="post-textarea"/>
            <button className="post-button">Post</button>
        </div>
    );
};

export default PostComposer;
