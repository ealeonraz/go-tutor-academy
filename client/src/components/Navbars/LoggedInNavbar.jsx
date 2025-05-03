import WebsiteLogo from "../../assets/go-tutor-academy-logo.png";
import profilepic from "../../assets/gohan-pic.webp";
import downarrow from "../../assets/down-arrow.png";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../NotificationBell/NotificationBell";
import { useAuth } from "../../context/AuthContext";
import "../Component.css";
import "./LoggedInNavbar.css"

export default function LoggedInMainNavbar() {
    const [showAccountPopup, setShowAccountPopup] = useState(false);
    const accountButtonRef = useRef(null);
    const navigate = useNavigate();
    const auth = useAuth();

    const togglePopup = () => {
        setShowAccountPopup((prev) => !prev);
    };

    // Close the popup if clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (accountButtonRef.current && !accountButtonRef.current.contains(event.target)) {
                setShowAccountPopup(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* Sending user to Homepage after logging out */
    const handleLogout = () => {
        auth.logout();
    }

    const handleAccountSettings = () => {
        console.log("Account Settings clicked");
        navigate("/AccountSettings"); // Redirect to account settings page
    }

    const handleDashboard = () => {
        console.log("Dashboard button clicked");
        navigate("/Dashboard"); // Redirect to account settings page
    }

    /* Sending user to homepage with account logged-in */
    const sendToMain = () => {
        console.log("navigating to Main Page");
        navigate("/");
    }

    return (
        <div className="logged-in-main-navbar">
            <div className="logo-small" onClick={sendToMain}>
                <img src={WebsiteLogo} />
            </div>

            {/* Account Button and Overlay */}
            <div className="account-container" ref={accountButtonRef}>
                <div className="account-picture">
                    <img src={profilepic} alt="Profile" />
                </div>
                <NotificationBell />
                <button className="account-arrow-button" onClick={togglePopup} aria-expanded={showAccountPopup}>
                    <img src={downarrow} alt="Arrow" />
                </button>

                {/* Always render the overlay */}
                <div className={`account-overlay ${showAccountPopup ? "show" : ""}`}>
                    <div className="popup-content">
                        <button className="popup-button" onClick={handleDashboard}>
                            My Dashboard
                        </button>
                        <button className="popup-button" onClick={handleAccountSettings}>
                            Account Settings
                        </button>
                        <button className="popup-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}