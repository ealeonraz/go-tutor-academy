import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import TutorDashboardNavbar from '../components/TutorDashboardNavbar';
import Navbar from '../components/LoggedInNavbar';

import './Page.css';
import profilePic from '../assets/mr-satan-pic.webp';
import TutorDashboardHome from './TutorDashboard';

export default function TDH_yourStudents() {
    const [students, setStudents] = useState([])

    useEffect(() => {
        async function fetchStudents() {
            try {
                const response = await fetch('/api/tutors');    
                if(!response.ok){
                    throw new Error("Failed to fetch students");
                }
                const data = await response.json();
            } catch (error) {
                console.error('Error fetching the students:', error);
            }
        }

        fetchStudents();
    }, []);

    return (
        <div className="tutor-dashboard-container">
            <Navbar />
            <TutorDashboardNavbar />
            <div className="your-students-content">
                <div className="your-students-box">
                    <div className="students-card-group">
                        {students.length > 0 ? (tutors.map((tutor, index) => (
                            <button key={index} className="students-card">
                                {student.name} { /* Displays the student's name */}
                            </button>
                        ))
                        ) : (
                            <p> No students yet</p> // Message if no students are found
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}