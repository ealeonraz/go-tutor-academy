// src/components/DeleteConfirmationModal.jsx
import React from 'react';
import './DeleteConfirmationModal.css'; // Import the updated CSS file

const DeleteConfirmationModal = ({ event, onDelete, onCancel }) => {
  return (
    <div className="delete-confirmation-modal">
      <div className="delete-modal-content">
        <h3 className="delete-modal-header">Are you sure you want to delete this appointment?</h3>
        <div className="delete-modal-info">
          <span><strong>{event.title}</strong></span>
          <span>{new Date(event.start).toLocaleString([], {
            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
          })}</span>
        </div>
        <div className="delete-modal-actions">
          <button onClick={() => onDelete(event)} className="delete-confirm-btn">
            Yes, Delete
          </button>
          <button onClick={onCancel} className="delete-cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
