import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import TutorDashboardNavbar from '../components/TutorDashboardNavbar';
import Navbar from '../components/LoggedInNavbar';
import profilePic from '../assets/mr-satan-pic.webp';  // Default profile picture in case the avatar is missing

import './Page.css';

// Function to parse the JWT token and return the decoded payload
function parseJwt(token) {
    try {
        const base64url = token.split(".")[1];
        const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);  // Return the decoded payload
    } catch (error) {
        console.error("Failed to parse JWT", error);
        return null;
    }
}

function TutorDashboardHome() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentTime, setCurrentTime] = useState('');
    const [timeMessage, setTimeMessage] = useState('');
    const [userInfo, setUserInfo] = useState(null);  // Store user data, including avatar
    const [loading, setLoading] = useState(true); // Loading state to manage user data fetch

    useEffect(() => {
        // Get the token from localStorage
        const token = localStorage.getItem('token');

        if (token) {
            // Decode the token and get the user information
            const decodedToken = parseJwt(token);
            if (decodedToken && decodedToken.email) {
                // Fetch user data using the email from decoded token (e.g., from your backend)
                fetchUserData(decodedToken.email);
            } else {
                console.error("Invalid or expired token.");
            }
        } else {
            console.error("No token found.");
        }

        const intervalId = setInterval(() => {
            const currentHour = new Date().getHours();
            if (currentHour >= 5 && currentHour < 12) {
                setCurrentTime("Good Morning, ");
                setTimeMessage("Ready to inspire minds and guide students today?");
            } else if (currentHour >= 12 && currentHour < 18) {
                setCurrentTime("Good Afternoon, ");
                setTimeMessage("A great time to check in and help students succeed!");
            } else {
                setCurrentTime("Good Evening, ");
                setTimeMessage("Ready to wrap up and prepare for tomorrow?");
            }
            setCurrentDate(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    // Function to fetch user data
    const fetchUserData = async (email) => {
        try {
            setLoading(true);  // Start loading
            const response = await fetch(`http://localhost:4000/api/users/${email}`);  // Modify the URL as per your API route
            if (response.ok) {
                const data = await response.json();
                setUserInfo(data);  // Store the user info, including avatar URL
            } else {
                console.error("Error fetching user data.");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);  // Stop loading after fetch is complete
        }
    };

    return (
        <div className="tutor-dashboard-container">
            <Navbar />
            <TutorDashboardNavbar />
            <div className="tutor-dashboard-content">
                <div className="tutor-welcome-box">
                    <div className="date">
                        <p>{currentDate.toLocaleDateString()}</p>
                    </div>
                    <div className="name-message">
                        <h1>{currentTime}{userInfo ? userInfo.firstName : 'Tutor'}</h1>
                        <h4>{timeMessage}</h4>
                    </div>
                    <div className="user-picture">
                        <img
                            src={userInfo && userInfo.avatarURL ? userInfo.avatarURL : profilePic}
                            alt="User Avatar"
                            className="avatar-img"
                        />
                    </div>
                </div>

                {/* Typewriter Effect */}
                <div className="typewriter-container">
                    <p className="typwriter-text">What are we searching for this time?</p>
                </div>

                {/* Search Bar */}
                <div className="search-bar-container">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Search for students..."
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                console.log("Search submitted:", e.target.value);
                                // Add your search logic here
                            }
                        }}
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default TutorDashboardHome;