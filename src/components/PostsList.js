import React from 'react';
import './PostsList.css';

const PostsList = ( {posts }) => {

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
