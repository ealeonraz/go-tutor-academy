import React from 'react';
import { Edit, X } from 'lucide-react'; // Import icons
import './ManageSubjects.css'

// ManageSubjectsOverlay Component
const ManageSubjectsOverlay = ({ subjects, onDelete, onEdit, onClose }) => {
  return (
    <div className="overlay">
      <div className="overlay-content">
        <button className="close-overlay-btn" onClick={onClose}>
          &times; {/* Close the overlay */}
        </button>
        <h2>Manage Subjects</h2>
        <ul className="subject-list">
          {subjects.map((subject) => (
            <li key={subject.id}>
              <div className="edit-delete-icons">
                <X className="icon" onClick={() => onDelete(subject.id)} /> {/* Delete icon */}
                <Edit className="icon" onClick={() => onEdit(subject)} /> {/* Edit icon */}
              </div>
              {subject.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageSubjectsOverlay;
