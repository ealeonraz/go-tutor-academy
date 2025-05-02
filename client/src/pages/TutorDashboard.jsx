import React, { useState, useEffect } from 'react';
import Header from '../components/LoggedInNavbar';  // Keep the original Navbar
import TutorDashboardNavbar from '../components/TutorDashboardNavbar';
import Footer from '../components/Footer';
import { Calendar, Users, UserPlus } from 'lucide-react';  // Importing correct icons
import './TutorDashboard.css';

function TutorDashboardHome() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTutors: 0,
        appointmentsThisMonth: 0,
    });
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [timeMessage, setTimeMessage] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        // Update greeting message based on time
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

        // Clean up the interval on unmount
        return () => clearInterval(intervalId);
    }, []);

    // Fetch statistics like total students, tutors, appointments, etc.
    useEffect(() => {
        // Simulate fetching tutor and student stats (replace with actual API calls)
        setStats(prev => ({
            ...prev,
            totalTutors: 10,
            totalStudents: 50,
            appointmentsThisMonth: 30,
        }));

        // Fetch upcoming appointments (replace with actual API calls)
        setUpcomingAppointments([
            { subject: "Math", tutor: "John Doe", start: "2025-05-01T10:00:00", end: "2025-05-01T11:00:00" },
            { subject: "Science", tutor: "Jane Doe", start: "2025-05-02T14:00:00", end: "2025-05-02T15:00:00" },
        ]);
    }, []);

    return (
        <div className="tutor-dashboard-container">
            <Header />
            <TutorDashboardNavbar />
            <div className="tutor-dashboard-body">
                <main className="tutor-dashboard-content">
                    <div className="tutor-welcome-header">
                        <h1>{currentTime}Tutor</h1>
                        <h4 className="tutor-tagline">{timeMessage}</h4>
                    </div>

                    <div className="overview-section">
                        <div className="overview-card">
                            <div className="card-icon"><Users /></div>
                            <h2>{stats.totalStudents}</h2>
                            <p>Total Students</p>
                        </div>
                        <div className="overview-card">
                            <div className="card-icon"><UserPlus /></div>
                            <h2>{stats.totalTutors}</h2>
                            <p>Total Tutors</p>
                        </div>
                        <div className="overview-card">
                            <div className="card-icon"><Calendar /></div>
                            <h2>{stats.appointmentsThisMonth}</h2>
                            <p>Appointments (This Month)</p>
                        </div>
                    </div>

                    <div className="upcoming-section">
                        <h3>Upcoming Appointments</h3>
                        <ul className="upcoming-appointments">
                            {upcomingAppointments.length > 0 ? (
                                upcomingAppointments.map((appointment, index) => (
                                    <li className="appointment-item" key={index}>
                                        <h4>{appointment.subject}</h4>
                                        <p><strong>Tutor:</strong> {appointment.tutor}</p>
                                        <p><strong>Start:</strong> {new Date(appointment.start).toLocaleString()}</p>
                                        <p><strong>End:</strong> {new Date(appointment.end).toLocaleString()}</p>
                                    </li>
                                ))
                            ) : (
                                <p>No upcoming appointments.</p>
                            )}
                        </ul>
                    </div>

                    <div className="tutor-quick-actions">
                        <button className="action-button">Manage Availability</button>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default TutorDashboardHome;
