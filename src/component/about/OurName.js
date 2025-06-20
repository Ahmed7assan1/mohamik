import React from "react";
import styles from "./OurName.module.css";

function OurName() {
    return(   
        <div className={styles["ourname-class"]}>
            <div>
                <h3>
                    اسمنا سهل الحفظ.وأعمالنا لا تُنسى.
                </h3>
                <p>
                    في محاميك، نؤمن بأن لكل قضية طابعها الفريد، لذا نوفر لك خدمات قانونية موجهة لتلبية متطلباتك الفردية. من خلال العمل المباشر مع محامينا الخبراء، نساعدك على بناء خطة قانونية متكاملة تناسب وضعك وتحقق أهدافك بفعالية. سواء كانت قضية حساسة، استشارة متخصصة، أو دعم قانوني شامل، نحن هنا لتقديم حلول استثنائية تعكس رؤيتك وتضمن راحتك القانونية.
                </p>
            </div>
            <div>
                <img src="/pics/magnet-me-LDcC7aCWVlo-unsplash 1.png" alt="Our Team" />
            </div>
        </div>
    );
}

export default OurName;