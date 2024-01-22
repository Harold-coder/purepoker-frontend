import React, { useEffect, useState } from 'react';
import PostsList from '../components/PostsList';
import PostComposer from '../components/PostComposer';
import RightSidebar from '../components/RightSidebar';
import DetailedPostView from '../components/DetailedPostView';
import './CommunityPage.css';
import axios from 'axios';
import { urlServer } from '../App';

const CommunityPage = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);

    // Mock comments data
    const comments = [
        { author: "User1", content: "Great post!" },
        { author: "User2", content: "Interesting perspective." }
        // You would fetch real comments from your backend
    ];

    const handlePostClick = (post) => {
        setSelectedPost(post);
    };

    const handleCloseDetailedView = () => {
        setSelectedPost(null);
    };

    const fetchPosts = () => {
        axios.get(`${urlServer}/posts`)
            .then(response => {
                setPosts(response.data.sort((a, b) => b.id - a.id));
                setFilteredPosts(response.data.sort((a, b) => b.id - a.id));  // Initialize filtered posts
            })
            .catch(error => console.error('Error fetching posts:', error));
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleSearch = (searchTerm) => {
        if (searchTerm) {
            const filtered = posts.filter(post => 
                post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPosts(filtered);
        } else {
            setFilteredPosts(posts);
        }
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
            {selectedPost ? (
                <DetailedPostView 
                    post={selectedPost} 
                    onClose={handleCloseDetailedView} 
                    comments={comments} 
                />
            ) : (
                <div className="feed-container">
                    <PostComposer onPostCreated={fetchPosts} />
                    <PostsList posts={filteredPosts} setPosts={setPosts} onLike={handleLike} onDelete={handleDelete} onPostClick={handlePostClick}/>
                </div>
            )}
            <RightSidebar onSearch={handleSearch} posts={posts} onClose={handleCloseDetailedView}/>
        </div>
    );
};

export default CommunityPage;