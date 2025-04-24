import React, { useState, useEffect } from 'react';
import Footer from '../../components/Footer';
import DashboardNavbar from '../../components/Navbars/DashboardNavbar';
import Navbar from '../../components/Navbars/LoggedInNavbar';

import './YourTutors.css';
import profilePic from '../../assets/gohan-pic.webp';

export default function SDH_yourTutors() {
    const [tutors, setTutors] = useState([])

    useEffect(() => {
        async function fetchTutors() {
            try {
                const response = await fetch('/api/tutors');
                if(!response.ok){
                    throw new Error("Failed to fetch tutors");
                }
                const data = await response.json();
            } catch (error) {
                console.error('Error fetching the tutors:', error);
            }
        }

        fetchTutors();
    }, []);

    return (
        <div className="Dashboard-container">
            <Navbar />
            <DashboardNavbar />
            <div className="your-tutors-content">
                <div className="your-tutors-box">
                    <div className="tutors-card-group">
                        {tutors.length > 0 ? (tutors.map((tutor, index) => (
                            <button key={index} className="tutors-card">
                                {tutor.name} { /* Displays the tutor's name */}
                            </button>
                        ))
                        ) : (
                            <p> No tutors booked yet</p> // Message if no tutors are found
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}