import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import StudentDashboardNavbar from '../components/DashboardNavbar';
import Navbar from '../components/LoggedInNavbar';

import './Page.css';
import profilePic from '../assets/gohan-pic.webp';

export default function SDH_yourTutors() {
    const [tutors, setTutors] = useState([])

    useEffect(() => {
        async function fetchTutors() {
            try {
                const response = await fetch('/api/tutors');
                const data = await response.json();
            } catch (error) {
                console.error('Error fetching the tutors:', error);
            }
        }

        fetchTutors();
    }, []);

    return (
        <div className="search-tutor-result-container">
            <Navbar />
            <StudentDashboardNavbar />
            <div className="search-tutor-result-content">
                <div className="filter-box"></div>
                <div className="tutors-box"></div>
            </div>
            <Footer />
        </div>
    );
}