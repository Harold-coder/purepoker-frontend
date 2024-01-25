// PostFeed.js
import React, { useState } from 'react';
import "./SearchPost.css";

const SearchPost = ( {onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        onSearch(event.target.value);
    };

    return (
        <div className="search-posts">
            <input 
                type="text" 
                placeholder="Search posts..." 
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
            />
        </div>
    );
};

export default SearchPost;