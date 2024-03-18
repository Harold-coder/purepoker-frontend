import React, { useState } from 'react';
import axios from 'axios';
import "./PostComposer.css";
import { urlServer } from '../../App';
import { useAuth } from '../../context/AuthContext';

const PostComposer = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const { user } = useAuth(); 
    axios.defaults.withCredentials = true;
    

    const handleSubmit = () => {
        // Trim the content to remove leading and trailing white spaces
        const trimmedContent = content.trim();
    
        // Check if the trimmed content is not empty
        if (trimmedContent) {
            const postData = {
                author: user.username,
                content: trimmedContent // Use trimmed content
            };
        
            axios.post(`${urlServer}/posts`, postData)
                .then(response => {
                    console.log('Success:', response.data);
                    setContent(''); // Clear the textarea
                    onPostCreated(); // Callback to update UI accordingly
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } else {
            console.log('Post content cannot be empty.');
            // Optionally, show an error message to the user
        }
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
