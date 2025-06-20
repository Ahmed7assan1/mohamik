import React from "react";
import styles from "./Callus.module.css";

function Callus() {
    return (
        <div className={styles.callus}>
            <div>
                <img src="/pics/asset.png" alt=" " />
            </div>
            <div>
                <div>
                    <h5>اتصل بنا للحصول على المساعدة القانونية </h5>
                    <p>محامون ذوو خبرة مستعدون للقتال من أجل حقوقك</p>
                </div>
                <div>
                    <button className={styles["btn-call"]}>
                        مجالات القانون لدينا
                    </button>
                    <span>
                        نجاحات جديدة &#8598;
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Callus;