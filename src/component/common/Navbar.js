import React from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Navbar.module.css";

function Nav({ userRole, onLogout }) {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles["navbar-logo"]} onClick={() => handleNavigation("/")}>
                <img src="/pics/dadc53c8aa5aabc47c9dc4e7d3484902.png" alt="Logo" />
            </div>
            <ul className={styles["navbar-links"]}>
                <li onClick={() => handleNavigation("/login")}>الرئيسية</li>
                <li onClick={() => handleNavigation("/lawyers")}>محامينا</li>
                <li onClick={() => handleNavigation("/services")}>خدماتنا</li>
                <li onClick={() => handleNavigation("/company")}>الشركة</li>
                <li onClick={() => handleNavigation("/contact")}>اتصل بنا</li>
            </ul>
            <div className={styles["navbar-icons"]}>
                <img src="/pics/Icons/Heart.png" alt="Heart Icon" />
                <img src="/pics/Icons/Handbag.png" alt="Handbag Icon" />
                <img src="/pics/Icons/MagnifyingGlass.png" alt="Search Icon" />
                
                {userRole ? (
                    <>
                        <Link to={userRole === 'Lawyer' ? '/lawyer-profile' : '/client-profile'}>
                            <img src="/pics/Icons/User.png" alt="User Profile" />
                        </Link>
                        <button onClick={onLogout} className={styles["logout-btn"]}>
                            تسجيل الخروج
                        </button>
                    </>
                ) : (
                    <Link to="/login">
                        <img src="/pics/Icons/User.png" alt="Login Icon" />
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Nav;