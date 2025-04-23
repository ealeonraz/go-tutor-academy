import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/LoggedInNavbar';
import StudentDashboardNavbar from '../components/DashboardNavbar';
import Footer from '../components/Footer';
import profilePic from '../assets/gohan-pic.webp';  // Default profile picture in case the avatar is missing

import './Page.css';

function StudentDashboardHome() {
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

return (
  <div className="student-dashboard-container">
      <Navbar />
      <StudentDashboardNavbar />
      <div className="student-dashboard-content">
          <div className="student-welcome-box">
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

export default StudentDashboardHome;