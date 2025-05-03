import React, { useEffect, useState } from 'react';
import StudentDashboardNavbar from '../components/Navbars/DashboardNavbar';
import Header from '../components/Navbars/LoggedInNavbar';
import './TutorProfileView.css';

const StudentProfileView = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch all students from the backend when the component mounts
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:4000/api/students', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error('Failed to fetch students');

        const data = await res.json();
        setStudents(data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      }
    };

    fetchStudents();
  }, []);

  // Delete a student by ID and update the local state
  const handleDeleteStudent = async (studentId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/students/${studentId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Failed to delete student");

      setStudents(prev => prev.filter(s => s._id !== studentId));
      setSelectedStudent(null);
      setShowConfirm(false);
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("Failed to delete student");
    }
  };

  return (
    <div className="tutor-profile-page">
      <Header />
      <StudentDashboardNavbar />
      <h2>Tutor Profiles</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display all students in a grid layout */}
      <div className="tutor-grid">
        {students.map(student => (
          <div key={student._id} className="tutor-card" onClick={() => setSelectedStudent(student)}>
            <img
              src={student.profileLink || "https://via.placeholder.com/120"}
              alt={`${student.firstName} ${student.lastName}`}
              className="tutor-profile-pic"
            />
            <h3>{student.firstName} {student.lastName}</h3>
            <p>{student.email}</p>
            <p className="subjects">{student.subjects?.join(', ')}</p>
          </div>
        ))}
      </div>

      {/* Modal to show detailed student profile */}
      {selectedStudent && (
        <div className="tutor-modal-overlay" onClick={() => { setSelectedStudent(null); setShowConfirm(false); }}>
          <div className="tutor-modal" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedStudent.profileLink || "https://via.placeholder.com/140"}
              alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
              className="modal-image"
            />
            <h2>{selectedStudent.firstName} {selectedStudent.lastName}</h2>

            <div className="badge-group">
              {selectedStudent.subjects?.map((subj, i) => (
                <span key={i} className="subject-badge">{subj}</span>
              ))}
            </div>

            <div className="about-box">
              <h3>About Me</h3>
              <p>{selectedStudent.bio || "This student has not provided a bio yet."}</p>
            </div>

            <h3>Latest Reviews</h3>
            <div className="review-grid">
              <div className="review-card">
                <strong>Enthusiastic Learner!</strong>
                <p>Always on time and ready to improve!</p>
                <em>— Piccolo</em>
              </div>
              <div className="review-card">
                <strong>Works Hard</strong>
                <p>Very respectful and asks great questions</p>
                <em>— Gohan</em>
              </div>
              <div className="review-card">
                <strong>Focused</strong>
                <p>Listens well and applies feedback quickly</p>
                <em>— Videl</em>
              </div>
            </div>

            {/* Confirmation and delete actions */}
            <div className="modal-buttons">
              {!showConfirm ? (
                <button className="btn danger" onClick={() => setShowConfirm(true)}>Delete Profile</button>
              ) : (
                <div className="confirm-delete">
                  <p>Are you sure you want to delete this user?</p>
                  <button className="btn danger-outline" onClick={() => handleDeleteStudent(selectedStudent._id)}>Yes</button>
                  <button className="btn outline" onClick={() => setShowConfirm(false)}>No</button>
                </div>
              )}
              <button className="btn outline" onClick={() => setSelectedStudent(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfileView;
