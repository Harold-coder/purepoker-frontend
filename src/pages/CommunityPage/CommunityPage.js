import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import RightSidebar from '../../components/CommunityComponents/RightSidebar';
import './CommunityPage.css';
import axios from 'axios';
import NavigationMenu from '../../components/CommunityComponents/NavigationMenu';
import { urlServer } from '../../App';

const CommunityPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPosts = () => {
        setLoading(true);
        axios.get(`${urlServer}/posts`)
            .then(response => {
                const sortedPosts = response.data.sort((a, b) => b.id - a.id);
                setLoading(false);
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
            <RightSidebar posts={posts} loading={loading}/>
        </div>
    );
};

export default CommunityPage;