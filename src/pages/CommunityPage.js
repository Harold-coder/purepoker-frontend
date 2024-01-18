import React, { useEffect, useState } from 'react';
import PostsList from '../components/PostsList';
import PostComposer from '../components/PostComposer';
import RightSidebar from '../components/RightSidebar';
import './CommunityPage.css';
import axios from 'axios';
import { urlServer } from '../App';

const CommunityPage = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);

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

    return (
        <div className="community-page-container">
            <div className="feed-container">
                <PostComposer onPostCreated={fetchPosts} />
                <PostsList posts={filteredPosts} setPosts={setPosts}/>
            </div>
            <RightSidebar onSearch={handleSearch}/>
        </div>
    );
};

export default CommunityPage;
