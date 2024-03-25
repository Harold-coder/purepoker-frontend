// Loading.js
import React from 'react';
import './Loading.css'; // Import the CSS file

const Loading = (size) => {
    console.log(size);
    return (
        <div className={`loading-container ${size.size}`}>
            <div className={`loading-circle ${size.size}-circle`}></div>
        </div>
    );
};

export default Loading;
