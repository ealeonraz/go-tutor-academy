import React, { useState, useEffect } from 'react';
import Header from '../components/Navbars/LoggedInNavbar';  // Keep the original Navbar
import StudentDashboardNavbar from '../components/Navbars/DashboardNavbar';
import Footer from '../components/Footer';
import { Pencil } from 'lucide-react';  // Import the Lucide Pencil icon
import { Users, UserPlus, Calendar } from 'lucide-react';  // Importing correct icons
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTutors: 0,
    appointmentsThisMonth: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [isOverlayVisible, setOverlayVisible] = useState(false); // State for overlay visibility
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [editingSubject, setEditingSubject] = useState(null); // Track the subject being edited

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTutorsInfo = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/tutors', {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch tutors info');
        const data = await response.json();
        setStats(prev => ({ ...prev, totalTutors: data.length }));
      } catch (error) {
        console.error("Error fetching tutors info:", error);
      }
    };
    fetchTutorsInfo();
  }, [token]);

  useEffect(() => {
    const fetchStudentsInfo = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/students', {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch students info');
        const data = await response.json();
        setStats(prev => ({ ...prev, totalStudents: data.length }));
      } catch (error) {
        console.error("Error fetching students info:", error);
      }
    };
    fetchStudentsInfo();
  }, [token]);

  useEffect(() => {
    const fetchAppointmentsThisMonth = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/events/this-month', {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch appointments this month');
        const data = await response.json();
        setStats(prev => ({ ...prev, appointmentsThisMonth: data.length }));
      } catch (error) {
        console.error("Error fetching appointments this month:", error);
      }
    };
    fetchAppointmentsThisMonth();
  }, [token]);

  useEffect(() => {
    const fetchUpcomingAppointments = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/events/upcoming', {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch upcoming appointments');
        const data = await response.json();
        setUpcomingAppointments(data);
      } catch (error) {
        console.error("Error fetching upcoming appointments:", error);
      }
    };
    fetchUpcomingAppointments();
  }, [token]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/subjects', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch subjects');
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, [token]);

  const handleOverlayToggle = () => {
    setOverlayVisible(!isOverlayVisible); // Toggle overlay visibility
    setEditingSubject(null); // Reset editing state when overlay is closed
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubject) return;
    try {
      const response = await fetch('http://localhost:4000/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: newSubject }),
      });
      if (!response.ok) throw new Error('Failed to add subject');
      const subject = await response.json();
      setSubjects(prev => [...prev, subject]);
      setNewSubject('');
    } catch (error) {
      console.error("Error adding subject:", error);
    }
  };

  const handleDelete = async (subjectId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/subjects/${subjectId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete subject');
      setSubjects(subjects.filter(subject => subject.id !== subjectId));
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setNewSubject(subject.name); // Populate the input field with the subject name
    setOverlayVisible(true); // Open the overlay
  };

  const handleUpdateSubject = async (e) => {
    e.preventDefault();
    if (!newSubject || !editingSubject) return;
    try {
      const response = await fetch(`http://localhost:4000/api/subjects/${editingSubject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: newSubject }),
      });
      if (!response.ok) throw new Error('Failed to update subject');
      const updatedSubject = await response.json();
      setSubjects(prev =>
        prev.map(subject =>
          subject.id === updatedSubject.id ? updatedSubject : subject
        )
      );
      setEditingSubject(null);
      setNewSubject('');
      setOverlayVisible(false); // Close overlay after update
    } catch (error) {
      console.error("Error updating subject:", error);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <Header />
      <StudentDashboardNavbar />
      <div className="admin-dashboard-body">
        <main className="admin-dashboard-content">
          <div className="admin-welcome-header">
            <h1>Welcome Back, Admin</h1>
            <h4 className="admin-tagline">Here's an overview of the platform activity.</h4>
          </div>

          <div className="admin-overview-section">
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

          <div className="admin-quick-actions">
            <button className="action-button" onClick={handleOverlayToggle}>Manage Subjects</button>
          </div>
        </main>
      </div>

      {isOverlayVisible && (
        <div className="overlay">
          <div className="overlay-content">
            <button className="close-overlay-btn" onClick={handleOverlayToggle}>&times;</button>
            <h2>{editingSubject ? "Edit Subject" : "Manage Subjects"}</h2>
            <ul className="subject-list">
              {subjects.length > 0 ? (
                subjects.map((subject, index) => (
                  <li key={index}>
                    {subject.name}
                    <div className="edit-delete-icons">
                      <span className="icon" onClick={() => handleEdit(subject)}>
                        <Pencil size={16} color="#7A4D94" /> {/* Lucide Pencil icon for edit */}
                      </span>
                      <span className="icon" onClick={() => handleDelete(subject.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                          <path d="M2.646 1.646a1 1 0 0 1 1.408 0L8 5.586l3.646-3.54a1 1 0 1 1 1.415 1.415L9.414 7l3.647 3.647a1 1 0 1 1-1.415 1.415L8 8.414l-3.646 3.54a1 1 0 1 1-1.415-1.415L6.586 7 2.939 3.353a1 1 0 0 1 0-1.414z"/>
                        </svg> {/* SVG X icon for delete */}
                      </span>
                    </div>
                  </li>
                ))
              ) : (
                <p>No subjects available.</p>
              )}
            </ul>
            <form onSubmit={editingSubject ? handleUpdateSubject : handleAddSubject}>
              <div className="form-group">
                <label htmlFor="new-subject">New Subject</label>
                <input
                  type="text"
                  id="new-subject"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Enter new subject name"
                />
              </div>
              <div className="form-actions">
                <button type="submit">{editingSubject ? "Update Subject" : "Add Subject"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default AdminDashboard;
