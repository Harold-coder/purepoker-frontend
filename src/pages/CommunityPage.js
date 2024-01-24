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

    const [comments, setComments] = useState([]);

    const fetchComments = (postId) => {
        axios.get(`${urlServer}/posts/${postId}/comments`)
            .then(response => {
                setComments(response.data);
            })
            .catch(error => console.error('Error fetching comments:', error));
    };

    const likeComment = (commentId) => {
        axios.post(`${urlServer}/comments/${commentId}/like`, { like: true })
            .then(response => {
                const updatedComments = comments.map(comment => {
                    if (comment.id === commentId) {
                        // Assuming the backend returns the updated like count
                        return { ...comment, likes: response.data.likes };
                    }
                    return comment;
                });
                setComments(updatedComments);
            })
            .catch(error => console.error('Error liking comment:', error));
    };

    const deleteComment = (commentId) => {
        axios.delete(`${urlServer}/comments/${commentId}`)
            .then(() => {
                const updatedComments = comments.filter(comment => comment.id !== commentId);
                setComments(updatedComments);
            })
            .catch(error => console.error('Error deleting comment:', error));
    };    

    const handlePostClick = (post) => {
        fetchComments(post.id);
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

    const selectPostFromSidebar = (postId) => {
        const post = posts.find(p => p.id === postId);
        if (post) {
            setSelectedPost(post);
        }
    };

    return (
        <div className="community-page-container">
            {selectedPost ? (
                <DetailedPostView 
                    post={selectedPost} 
                    onClose={handleCloseDetailedView} 
                    comments={comments} 
                    setComments={setComments}
                    likeComment={likeComment}
                    deleteComment={deleteComment}
                />
            ) : (
                <div className="feed-container">
                    <PostComposer onPostCreated={fetchPosts} />
                    <PostsList posts={filteredPosts} setPosts={setPosts} onLike={handleLike} onDelete={handleDelete} onPostClick={handlePostClick}/>
                </div>
            )}
            <RightSidebar 
                onSearch={handleSearch} 
                posts={posts} 
                onClose={handleCloseDetailedView} 
                onSelectPost={selectPostFromSidebar}
            />
        </div>
    );
};

export default CommunityPage;