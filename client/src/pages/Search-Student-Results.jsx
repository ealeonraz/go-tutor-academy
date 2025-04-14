import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import TutorDashboardNavbar from '../components/TutorDashboardNavbar';
import Navbar from '../components/LoggedInNavbar';

import './Page.css';
import profilePic from '../assets/mr-satan-pic.webp';

export default function TDH_yourStudents() {
    const [students, setStudents] = useState([])

    useEffect(() => {
        async function fetchStudents() {
            try {
                const response = await fetch('/api/students');
                const data = await response.json();
            } catch (error) {
                console.error('Error fetching the students:', error);
            }
        }

        fetchStudents();
    }, []);

    return (
        <div className="search-student-result-container">
            <Navbar />
            <TutorDashboardNavbar />
            <div className="search-student-result-content">
                <div className="filter-box"></div>
                <div className="students-box"></div>
            </div>
            <Footer />
        </div>
    );
}