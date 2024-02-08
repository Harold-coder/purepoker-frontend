import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import RightSidebar from '../components/RightSidebar';
import './CommunityPage.css';
import axios from 'axios';
import NavigationMenu from '../components/NavigationMenu';
import { urlServer, urlServerAuth } from '../App';

const CommunityPage = () => {
    const [posts, setPosts] = useState([]);

    const fetchPosts = () => {
        axios.get(`${urlServer}/posts`)
            .then(response => {
                const sortedPosts = response.data.sort((a, b) => b.id - a.id);
                setPosts(sortedPosts);
            })
            .catch(error => console.error('Error fetching posts:', error));
    };

    useEffect(() => {
        fetchPosts();
    }, []); 

    return (
        <div className="community-page-container">
            <NavigationMenu />
            <div className="feed-container">
                <Outlet />
            </div>
            <RightSidebar posts={posts}/>
        </div>
    );
};

export default CommunityPage;