import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PostsList.css';
import { urlServer } from '../App';

const PostsList = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get(`${urlServer}/posts`)
            .then(response => {
                const sortedPosts = response.data.sort((a, b) => b.id - a.id);
                setPosts(sortedPosts);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }, []);

    return (
        <div className="posts-list">
            {posts.map(post => (
                <div key={post.id} className="post">
                <h3>{post.author}</h3>
                <p>{post.content}</p>
                <div className="post-interactions">
                    <span className="likes">
                        <i className="fas fa-heart"></i> {post.likes}
                    </span>
                </div>
            </div>
            ))}
        </div>
    );
};

export default PostsList;
