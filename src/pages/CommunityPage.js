import React, { useEffect, useState } from 'react';
import PostsList from '../components/PostsList';
import PostComposer from '../components/PostComposer';
import RightSidebar from '../components/RightSidebar';
import './CommunityPage.css';
import axios from 'axios';
import { urlServer } from '../App';

const CommunityPage = () => {
    const [posts, setPosts] = useState([]);

    const fetchPosts = () => {
        axios.get(`${urlServer}/posts`)
            .then(response => {
                setPosts(response.data.sort((a, b) => b.id - a.id));
            })
            .catch(error => console.error('Error fetching posts:', error));
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="community-page-container">
            <div className="feed-container">
                <PostComposer onPostCreated={fetchPosts} />
                <PostsList posts={posts} setPosts={setPosts}/>
            </div>
            <RightSidebar />
        </div>
    );
};

export default CommunityPage;
