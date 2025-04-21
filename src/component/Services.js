import React from "react";

const Services = ({ imageSrc, title, description, isReversed }) => {
    return (
        <div className={`service-section ${isReversed ? "reverse" : ""}`}>
            <div className="service-content">
                <h2 className="service-title">{title}</h2>
                <p className="service-description">{description}</p>
            </div>
            <div className="service-image-container">
                <img src={imageSrc} alt={title} className="service-image" />
            </div>
        </div>
    );
};

export default Services;
