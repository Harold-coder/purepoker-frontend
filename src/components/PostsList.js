import React from 'react';
import './PostsList.css';

const PostsList = () => {
    // Array of mock posts
    const mockPosts = [
        { id: 1, author: 'User1', content: 'This is the first post', likes: 10 },
        { id: 2, author: 'User2', content: 'This is the second post', likes: 20 },
        { id: 3, author: 'User3', content: 'This is the third post', likes: 30 },
        // Add more mock posts as needed
    ];

    return (
        <div className="posts-list">
            {mockPosts.map(post => (
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
