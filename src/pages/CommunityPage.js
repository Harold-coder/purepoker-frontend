import React from 'react';
import PostsList from '../components/PostsList';
import PostComposer from '../components/PostComposer';
import RightSidebar from '../components/RightSidebar';
import './CommunityPage.css';

const CommunityPage = () => {
    return (
        <div className="community-page-container">
            <div className="feed-container">
                <PostComposer />
                <PostsList />
            </div>
            <RightSidebar />
        </div>
    );
};

export default CommunityPage;
