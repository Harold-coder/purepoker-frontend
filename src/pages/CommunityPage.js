import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostsList from '../components/PostsList';
import PostComposer from '../components/PostComposer';
import RightSidebar from '../components/RightSidebar';
import './CommunityPage.css';
import axios from 'axios';
import { urlServer } from '../App';

const CommunityPage = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const navigate = useNavigate();

    const fetchPosts = () => {
        axios.get(`${urlServer}/posts`)
            .then(response => {
                const sortedPosts = response.data.sort((a, b) => b.id - a.id);
                setPosts(sortedPosts);
                setFilteredPosts(sortedPosts);
            })
            .catch(error => console.error('Error fetching posts:', error));
    };

    useEffect(() => {
        fetchPosts();
    }, []);   

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`);
    };

    const handleSearch = (searchTerm) => {
        const filtered = posts.filter(post => 
            post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPosts(filtered);
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

    const handleLike = (likedPost) => {
        const isLiked = likedPost.liked;
        const updatedPost = { ...likedPost, liked: !isLiked };

        axios.post(`${urlServer}/posts/${likedPost.id}/like`, { like: !isLiked })
            .then(response => {
                // Update both posts and filteredPosts
                const updatedPosts = posts.map(p => 
                    p.id === likedPost.id ? { ...updatedPost, likes: response.data.likes } : p
                );
                const updatedFilteredPosts = filteredPosts.map(p => 
                    p.id === likedPost.id ? { ...updatedPost, likes: response.data.likes } : p
                );
                setPosts(updatedPosts);
                setFilteredPosts(updatedFilteredPosts);
            })
            .catch(error => console.error('Error updating like:', error));
    };

    return (
        <div className="community-page-container">
            <div className="feed-container">
                <PostComposer onPostCreated={fetchPosts} />
                <PostsList 
                    posts={filteredPosts} 
                    onLike={handleLike} 
                    onDelete={handleDelete} 
                    onPostClick={handlePostClick}
                />
            </div>
            <RightSidebar onSearch={handleSearch} posts={posts}/>
        </div>
    );
};

export default CommunityPage;