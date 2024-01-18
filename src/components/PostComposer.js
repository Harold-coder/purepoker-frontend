import React, { useState } from 'react';
import axios from 'axios';
import "./PostComposer.css";
import { urlServer } from '../App';

const PostComposer = ({ onPostCreated }) => {
    const [content, setContent] = useState('');

    const handleSubmit = () => {
        const postData = {
            author: "Anonymous Author",
            content: content
        };
    
        axios.post(`${urlServer}/posts`, postData)
            .then(response => {
                console.log('Success:', response.data);
                setContent('');
                onPostCreated();
                // Update UI accordingly
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div className="post-composer">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="post-textarea"
            />
            <button onClick={handleSubmit} className="post-button">Post</button>
        </div>
        
    );
};

export default PostComposer;
