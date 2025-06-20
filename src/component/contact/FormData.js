import React from "react";
import styles from "./FormData.module.css";
import DelegationUpload from "../delegation/DelegationUpload";

function FormData() {
    return (
        <div className={styles.formSection}>
            <div>
                <img src="/pics/Rectangle 97.png" alt="TeamWork" />
            </div>
            <div>
                <h3>دعونا نعمل معًا</h3>
                <p>
                    يسعدنا أن نسمع منك! أرسل لنا رسالة باستخدام النموذج المقابل، أو راسلنا عبر البريد الإلكتروني.
                    يسعدنا أن نسمع منك! أرسل لنا رسالة باستخدام النموذج المقابل، أو راسلنا عبر البريد الإلكتروني.
                </p>
                <form>
                    <div>
                        <input type="text" name="first name" placeholder="First Name" />
                        <input type="text" name="last name" placeholder="Last Name" />
                    </div>
                    <input type="email" name="email" placeholder="Email address" />
                    <input type="tel" name="phone" placeholder="Phone number (Optional)" />
                    <textarea name="message" placeholder="How can we help you? (Max. 500 Characters)" />
                </form>
                <button>Submit now</button>
                <div style={{ marginTop: '2rem' }}>
                  <DelegationUpload />
                </div>
            </div>
        </div>
    );
}

export default FormData;
