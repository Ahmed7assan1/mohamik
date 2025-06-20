import React from 'react';
import styles from "./Info.module.css";

const Info = () => {
    const title = "عننا";
    const paragraph = `"محاميك" هو أول تطبيق وموقع مصري متخصص في تسهيل الوصول إلى الخدمات القانونية...`;
    const backgroundImage = "/pics/image66.png";

    return (
        <div className={styles.info} style={{ backgroundImage: `url(${backgroundImage})` }}>
            <h1>{title}</h1>
            <p>{paragraph}</p>
        </div>
    );
};

export default Info;