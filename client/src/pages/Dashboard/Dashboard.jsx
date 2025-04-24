import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbars/LoggedInNavbar';
import DashboardNavbar from '../../components/Navbars/DashboardNavbar';
import Footer from '../../components/Footer';
import profilePic from '../../assets/gohan-pic.webp';  // Default profile picture in case the avatar is missing

import './Dashboard.css';

function DashboardHome() {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentTime, setCurrentTime] = useState('');
    const [timeMessage, setTimeMessage] = useState('');
    const navigate = useNavigate();

    const intervalId = setInterval(() => {
        const currentHour = new Date().getHours();
        if (currentHour >= 5 && currentHour < 12) {
            setCurrentTime("Good Morning, ");
            setTimeMessage("Let's start the day off great in your studies!");
        } else if (currentHour >= 12 && currentHour < 18) {
            setCurrentTime("Good Afternoon, ");
            setTimeMessage("A good study session happens right after Lunch");
        } else {
            setCurrentTime("Good Evening, ");
            setTimeMessage("The night is still young, keep studying!");
        }
        setCurrentDate(new Date());
    }, 1000);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = LocalStorage.getItem('token');

            } catch (err) {
                console.error("Error fetching user info: ", err);
                setLoading(false);
            }
        }
    }, []);

/* Inputs a buffer page to let site load user info */
//if(!userInfo) return <div>Loading account settings...</div>;

return (
    <div className="Dashboard-container">
        <Navbar />
        <DashboardNavbar />
        <div className="Dashboard-content">
            <div className="welcome-box">
                <div className="date">
                    <p>{currentDate.toLocaleDateString()}</p>
                </div>
                <div className="name-message">
                    <h1>{currentTime}{userInfo ? userInfo.firstName : 'Student'}</h1>
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
                    placeholder="Search for tutors, subjects, or topics..."
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

export default DashboardHome;