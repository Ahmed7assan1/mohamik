import React from "react";
import styles from "./Services.module.css";

const Services = ({ imageSrc, title, description, isReversed }) => {
    return (
        <div className={`${styles["service-section"]} ${isReversed ? styles.reverse : ""}`}>
            <div className={styles["service-content"]}>
                <h2 className={styles["service-title"]}>{title}</h2>
                <p className={styles["service-description"]}>{description}</p>
            </div>
            <div className={styles["service-image-container"]}>
                <img src={imageSrc} alt={title} className={styles["service-image"]} />
            </div>
        </div>
    );
};

export default Services;
