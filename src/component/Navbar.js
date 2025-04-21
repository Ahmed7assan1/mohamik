import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Nav() {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo" onClick={() => handleNavigation("/")}>
                <img src="/pics/dadc53c8aa5aabc47c9dc4e7d3484902.png" alt="Logo" />
            </div>
            <ul className="navbar-links">
                <li onClick={() => handleNavigation("/")}>الرئيسية</li>
                <li onClick={() => handleNavigation("/lawyers")}>محامينا</li>
                <li onClick={() => handleNavigation("/services")}>خدماتنا</li>
                <li onClick={() => handleNavigation("/company")}>الشركة</li>
                <li onClick={() => handleNavigation("/contact")}>اتصل بنا</li>
            </ul>
            <div className="navbar-icons">
                <img src="/pics/Icons/Heart.png" alt="Heart Icon" />
                <img src="/pics/Icons/Handbag.png" alt="Handbag Icon" />
                <img src="/pics/Icons/MagnifyingGlass.png" alt="Search Icon" />
                <img src="/pics/Icons/User.png" alt="User Icon" />
            </div>
        </nav>
    );
}

export default Nav;