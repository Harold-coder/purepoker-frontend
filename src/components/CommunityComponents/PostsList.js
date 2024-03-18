import React from 'react';
import './PostsList.css';
import { useNavigate } from 'react-router-dom';
import Post from './Post';

const PostsList = ( { posts, onLike, onDelete }) => {
    const navigate = useNavigate();

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
                <Post key={post.id} data={post} onLike={handleLikeClick} onDelete={handleDeleteClick} onPostClick={handlePostClick} />
            ))}
        </div>
    );
};

export default PostsList;
