import React from "react";
import styles from "./HelloImage.module.css";

function Hello() {
    return (
        <div className={styles["hero-section"]}>
            <img src="/pics/Hello/8d2a31d79d4f88b45c48054409d8cbb7.png" alt="Hello Image" className={styles["hero-image"]} />
            <div className={styles["hero-content"]}>
                <h1>خدماتنا</h1>
                <p>
                    في محاميك، نحن ملتزمون بتقديم تجربة قانونية مميزة وسلسة. خدماتنا مصممة خصيصًا لتلبية احتياجاتك القانونية
                    بأعلى درجات الاحترافية والشفافية، مع ضمان حصولك على الدعم القانوني المناسب الذي يتماشى مع ظروفك وأهدافك.
                    نحن نفخر بتقديم خدمات تتجاوز مجرد الاستشارات، لضمان رحلة قانونية فريدة تساعدك على اتخاذ قراراتك بثقة وأمان.
                </p>
            </div>
        </div>
    );
}

export default Hello;
