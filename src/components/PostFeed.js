// PostFeed.js
import React, { useEffect, useState } from 'react';
import {useNavigate } from 'react-router-dom';
import PostsList from '../components/PostsList';
import PostComposer from '../components/PostComposer';
import axios from 'axios';
import { urlServer } from '../App';
import SearchPost from './SearchPost';
import { useAuth } from '../context/AuthContext';

const PostFeed = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);

    const { user } = useAuth(); 
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const fetchLikedPosts = async () => {
        try {
            // Assuming you have an endpoint to get IDs of liked posts
            const { data: likedPostsIds } = await axios.get(`${urlServer}/posts/likes`, { user_id: user.id });
            console.log(likedPostsIds);
            return likedPostsIds;
        } catch (error) {
            console.error('Error fetching liked posts:', error);
            return [];
        }
    };

    const fetchPosts = async () => {
        try {
            const likedPostsIds = await fetchLikedPosts();
            const { data } = await axios.get(`${urlServer}/posts`);
            const postsWithLikeStatus = data.map(post => ({
                ...post,
                liked: likedPostsIds.includes(post.id) // Add liked status
            }));
            setPosts(postsWithLikeStatus);
            setFilteredPosts(postsWithLikeStatus);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`);
    };

    const handleDelete = (postId) => {
        axios.delete(`${urlServer}/posts/${postId}`)
            .then(() => {
                const updatedPosts = posts.filter(post => post.id !== postId);
                const updatedFilteredPosts = filteredPosts.filter(post => post.id !== postId);
                setPosts(updatedPosts);
                setFilteredPosts(updatedFilteredPosts);
            })
            .catch(error => console.error('Error deleting post:', error));
    };

    const handleLike = (postToToggle) => {
        axios.post(`${urlServer}/posts/${postToToggle.id}/like`, { user_id: user.id })
            .then(response => {
                // Extracting the action and likes count from the response
                const { status, likes } = response.data;
                
                console.log(status);
                // Determine if the post was liked or unliked based on the 'status' returned from the server
                const isLiked = status === 'liked';
    
                // Update the posts and filteredPosts state to reflect the new like status and count
                const updatePosts = (posts) => posts.map(post => {
                    if (post.id === postToToggle.id) {
                        // Update the post with the new like status and count
                        return { ...post, liked: isLiked, likes };
                    }
                    return post;
                });
    
                setPosts(updatePosts(posts));
                setFilteredPosts(updatePosts(filteredPosts));
            })
            .catch(error => console.error('Error updating like:', error));
    };
    
    

    const handleSearch = (searchTerm) => {
        const filtered = posts.filter(post => 
            post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPosts(filtered);
    };

    return (
        <div className="post-feed-container">  
            <SearchPost onSearch={handleSearch} />
            <PostComposer onPostCreated={fetchPosts} />
            <PostsList 
                posts={filteredPosts} 
                onLike={handleLike} 
                onDelete={handleDelete} 
                onPostClick={handlePostClick}
            />
        </div>
    );
};

export default PostFeed;
