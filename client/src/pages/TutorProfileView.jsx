import React, { useEffect, useState } from 'react';
import StudentDashboardNavbar from '../components/Navbars/DashboardNavbar';
import Header from '../components/Navbars/LoggedInNavbar';  // Keep the original Navbar
import './TutorProfileView.css';

const TutorProfileView = () => {
  const [tutors, setTutors] = useState([]);
  const [error, setError] = useState('');
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch all tutors from the backend when the component mounts
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:4000/api/tutors', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error('Failed to fetch tutors');

        const data = await res.json();
        setTutors(data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      }
    };

    fetchTutors();
  }, []);

  // Delete a tutor by ID and update the local state
  const handleDeleteTutor = async (tutorId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/tutors/${tutorId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Failed to delete tutor");

      setTutors(prev => prev.filter(t => t._id !== tutorId));
      setSelectedTutor(null);
      setShowConfirm(false);
    } catch (err) {
      console.error("Error deleting tutor:", err);
      alert("Failed to delete tutor");
    }
  };

  return (
    <div className="tutor-profile-page">
      <Header />
      <StudentDashboardNavbar />
      <h2>Tutor Profiles</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display all tutors in a grid layout */}
      <div className="tutor-grid">
        {tutors.map(tutor => (
          <div key={tutor._id} className="tutor-card" onClick={() => setSelectedTutor(tutor)}>
            <img
              src={tutor.profileLink || "https://via.placeholder.com/120"}
              alt={`${tutor.firstName} ${tutor.lastName}`}
              className="tutor-profile-pic"
            />
            <h3>{tutor.firstName} {tutor.lastName}</h3>
            <p>{tutor.email}</p>
            <p className="subjects">{tutor.subjects?.join(', ')}</p>
          </div>
        ))}
      </div>

      {/* Modal to show detailed tutor profile */}
      {selectedTutor && (
        <div className="tutor-modal-overlay" onClick={() => { setSelectedTutor(null); setShowConfirm(false); }}>
          <div className="tutor-modal" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedTutor.profileLink || "https://via.placeholder.com/140"}
              alt={`${selectedTutor.firstName} ${selectedTutor.lastName}`}
              className="modal-image"
            />
            <h2>{selectedTutor.firstName} {selectedTutor.lastName}</h2>

            <div className="badge-group">
              {selectedTutor.subjects?.map((subj, i) => (
                <span key={i} className="subject-badge">{subj}</span>
              ))}
            </div>

            <div className="about-box">
              <h3>About Me</h3>
              <p>{selectedTutor.bio || "This tutor has not provided a bio yet."}</p>
            </div>

            <h3>Latest Reviews</h3>
            <div className="review-grid">
              <div className="review-card">
                <strong>He is the Strongest!</strong>
                <p>He helped me defeat Cell who is an android from another dimension</p>
                <em>— Goku</em>
              </div>
              <div className="review-card">
                <strong>Surprisingly Fantastic</strong>
                <p>Helped me pass my midterm</p>
                <em>— Chi Chi</em>
              </div>
              <div className="review-card">
                <strong>Kinda Crazy</strong>
                <p>But he knows what he is talking about</p>
                <em>— Michael</em>
              </div>
            </div>

            {/* Confirmation and delete actions */}
            <div className="modal-buttons">
              {!showConfirm ? (
                <button className="btn danger" onClick={() => setShowConfirm(true)}>Delete Profile</button>
              ) : (
                <div className="confirm-delete">
                  <p>Are you sure you want to delete this user?</p>
                  <button className="btn danger-outline" onClick={() => handleDeleteTutor(selectedTutor._id)}>Yes</button>
                  <button className="btn outline" onClick={() => setShowConfirm(false)}>No</button>
                </div>
              )}
              <button className="btn outline" onClick={() => setSelectedTutor(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorProfileView;