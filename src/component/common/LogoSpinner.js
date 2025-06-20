import React from "react";
import styles from "./LogoSpinner.module.css";

const LogoSpinner = ({ size = 60 }) => (
  <div className={styles.spinner} style={{ width: size, height: size }}>
    <img src={process.env.PUBLIC_URL + "/pics/dadc53c8aa5aabc47c9dc4e7d3484902.png"} alt="Loading..." className={styles.logo} style={{ width: size, height: size }} />
  </div>
);

export default LogoSpinner; 