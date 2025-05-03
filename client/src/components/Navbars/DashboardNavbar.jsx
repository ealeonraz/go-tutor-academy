import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardNavbar() {
  const navigate = useNavigate();

  // State for storing user info (email, role)
  const [userInfo, setUserInfo] = useState({
    email: "",
    role: "",
    roleName:"",
  });

  const token = localStorage.getItem('token'); // Get token from localStorage

  // Fetch user info based on the token
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/info/:id', {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` }, // Sending the token as-is
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }

        const data = await response.json();

        setUserInfo({
          email: data.email,  // Assuming the API returns the user's email and role
          role: data.roles[0] || 'guest',
          roleName: data.roleName, 
        });
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (token) {
      fetchUserInfo();
    }
  }, [token]);

  // Get the user role (default to 'guest' if not available)
  const userRole = userInfo.role
  const roleName = userInfo.roleName


  // Handle navigation based on user role
  const sendToHome = () => navigate(`/${roleName}-dashboard/`);
  const sendToYourTutors = () => navigate(`/${roleName}-dashboard/your-tutors`);
  const sendToYourStudents = () => navigate(`/${roleName}-dashboard/students`);
  const sendToCalendar = () => navigate(`/${roleName}-dashboard/calendar`);
  const sendToAppointments = () => navigate(`/${roleName}-dashboard/appointments`);
  const sendToEvents = () => navigate(`/${roleName}-dashboard/events`);
  const sendToManageTutors = () => navigate(`/${roleName}-dashboard/tutors`);
  const sendToPayroll = () => navigate(`/tutor-dashboard/payroll`)


  // Define different navbar items based on role
  const renderNavbar = () => {
    switch (userRole) {
      case '67fc5b4862b00200769805b6':
        return (
          <>
            <div className="dashboard-button" onClick={sendToYourTutors}>Your Tutors</div>
            <div className="dashboard-button" onClick={sendToAppointments}>Appointments</div>
            <div className="dashboard-button" onClick={sendToHome}>Home</div>
            <div className="dashboard-button" onClick={sendToCalendar}>Calendar</div>
            <div className="dashboard-button" onClick={sendToEvents}>Events</div>
          </>
        );
      case '67fc5b4862b00200769805b5':
        return (
          <>
            <div className="dashboard-button" onClick={sendToYourStudents}>My Students</div>
            <div className="dashboard-button" onClick={sendToAppointments}>View Appointments</div>
            <div className="dashboard-button" onClick={sendToHome}>Home</div>
            <div className="dashboard-button" onClick={sendToCalendar}>My Calendar</div>
            <div className="dashboard-button" onClick={sendToPayroll}>Payroll</div>
          </>
        );
      case '67fc5b4862b00200769805b4':
        return (
          <>
            <div className="dashboard-button" onClick={sendToPayroll}>Payroll</div>
            <div className="dashboard-button" onClick={sendToManageTutors}>Manage Tutors</div>
            <div className="dashboard-button" onClick={sendToHome}>Dashboard</div>
            <div className="dashboard-button" onClick={sendToCalendar}>Manage Students</div>
            <div className="dashboard-button" onClick={sendToEvents}>Manage Events</div>
          </>
        );
      default:
        return (
          <>
            <div className="dashboard-button" onClick={sendToHome}>Home</div>
          </>
        );
    }
  };

  return (
    <div className="dashboard-nav-main">
      <div className="dashboard-buttons-group">
        {renderNavbar()}
      </div>
    </div>
  );
}
