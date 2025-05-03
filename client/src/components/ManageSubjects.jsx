import React, { useState, useEffect } from "react";
import "./Feedback/Feedback.css"; // Reuse existing modal styling
import { useAuth } from "../context/AuthContext.jsx";


export default function ManageSubjects({ onClose }) {
  const { user, setUser } = useAuth();
  const [subjects, setSubjects] = useState(user?.subjects || []);

  const [isTutor, setIsTutor] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await fetch(`http://localhost:4000/api/info/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log("Fetched role from info route:", data.roleName);
        if (data.roleName === "tutor") {
          setIsTutor(true);
        } else {
          alert("Access denied: only tutors can update subjects.");
        }
      } catch (err) {
        console.error("Error fetching role info:", err);
      }
    };
    fetchRole();
  }, []);

  const [newSubject, setNewSubject] = useState("");
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = user?.id;
  
        if (!token || !userId) return;
  
        const res = await fetch(`http://localhost:4000/api/info/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await res.json();
        console.log("Fetched role from info route:", data.roleName); // Debug
        setRole(data.roleName);
      } catch (err) {
        console.error("Error fetching role:", err);
      }
    };
  
    fetchUserRole();
  }, [user]);

  const handleAddSubject = () => {
    const trimmed = newSubject.trim();
    if (trimmed && !subjects.includes(trimmed)) {
      setSubjects(prev => [...prev, trimmed]);
      setNewSubject("");
    }
  };

  const handleRemoveSubject = (subjectToRemove) => {
    setSubjects(prev => prev.filter(sub => sub !== subjectToRemove));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const tutorId = user?.id;
  
    if (!tutorId) {
      alert("User ID not found. Are you logged in?");
      return;
    }
  
    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:4000/api/tutors/${tutorId}/subjects`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subjects }), // 'subjects' is your selected subject list
      });
  
      if (response.ok) {
        alert("Subjects updated successfully!");
        onClose(); // Close the modal
      } else {
        const errData = await response.json();
        console.error("Failed to update subjects:", errData);
        alert("Failed to update subjects.");
      }
    } catch (err) {
      console.error("Error updating subjects:", err);
      alert("An error occurred while updating subjects.");
    }
  };
  
    

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="form-step">
          <h2>Manage Subjects</h2>
          <div className="form-group">
            <label htmlFor="newSubject">Add a subject</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                id="newSubject"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="e.g. Math"
              />
              <button type="button" className="btn next-btn" onClick={handleAddSubject}>Add</button>
            </div>
          </div>

          {subjects.length > 0 && (
            <div className="checkbox-group">
              {subjects.map((subject, index) => (
                <label key={index}>
                  <input
                    type="checkbox"
                    checked
                    onChange={() => handleRemoveSubject(subject)}
                  />
                  {subject}
                </label>
              ))}
            </div>
          )}

          <div className="button-group">
            <button className="btn back-btn" onClick={onClose}>Cancel</button>
            <button className="btn submit-btn" onClick={handleSave}>Save Subjects</button>
          </div>
        </div>
      </div>
    </div>
  );
}
