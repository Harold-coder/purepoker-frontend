import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import RightSidebar from '../components/RightSidebar';
import './CommunityPage.css';
import axios from 'axios';
import NavigationMenu from '../components/NavigationMenu';
import { urlServer, urlServerAuth } from '../App';

const CommunityPage = () => {
    // In your main App component or in a useEffect within your AuthProvider
    useEffect(() => {
        const validateUserSession = async () => {
        try {
            const response = await axios.post(`${urlServerAuth}/validate_token`, { withCredentials: true });
            if (response.data.message === 'Token is valid') {
            // User is authenticated, update state accordingly
            console.log(response);
            }
        } catch (error) {
            console.error('Session validation error:', error);
            // Handle error, possibly logging the user out or redirecting to login
        }
        };
    
        validateUserSession();
    }, []); // Empty dependency array ensures this runs once on mount
  
    axios.defaults.withCredentials = true;
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