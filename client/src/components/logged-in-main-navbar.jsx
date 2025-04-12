import logo from "../assets/go-tutor-academy-logo.png";
import profilepic from "../assets/gohan-pic.webp";
import downarrow from "../assets/down-arrow.png";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

import "./Component.css";

export default function LoggedInMainNavbar() {
    const [showAccountPopup, setShowAccountPopup] = useState(false);
    const accountButtonRef = useRef(null);
    const navigate = useNavigate();

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
        console.log("logout clicked");
        navigate("/");
    }

    /* Sending user to homepage with account logged-in */
    const sendToMain = () => {
        console.log("navigating to Main Page");
        navigate("/");
    }

    return (
        <div className="logged-in-main-navbar">
            <div className="logo" onClick={sendToMain}>
                <img src={logo} alt="Go Tutor Academy Logo" />
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
                        <button className="popup-button" onClick={() => console.log("Account Settings clicked")}>
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