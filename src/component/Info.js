import React from 'react';
import "./Info.css";
const Info = ({ title, paragraph, backgroundImage }) => {
    return (
        <div  className="info"  style={{ backgroundImage: `url(${backgroundImage})` }}>
            <h1>{title}</h1>
            <p>{paragraph}</p>
        </div>
    );
};

export default Info;