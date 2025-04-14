import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/logged-in-main-navbar';
import StudentDashboardNavbar from '../components/DashboardNavbar';
import Footer from '../components/Footer';
import profilePic from '../assets/gohan-pic.webp';  // Default profile picture in case the avatar is missing

import './Page.css';

function StudentDashboardHome() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  return (
    <div className="student-dashboard-container">
      <Navbar />
      <StudentDashboardNavbar />
      <div className="student-dashboard-content">
        <div className="student-welcome-box">
          <div className="date">
            <p>{new Date().toLocaleDateString()}</p>
          </div>
          <div className="name-message">
            <h1>{userInfo ? userInfo.firstName : 'Student'}</h1>
          </div>
          <div className="user-picture">
            <img
              src={userInfo && userInfo.avatarURL ? userInfo.avatarURL : profilePic}
              alt="User Avatar"
              className="avatar-img"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default StudentDashboardHome;
