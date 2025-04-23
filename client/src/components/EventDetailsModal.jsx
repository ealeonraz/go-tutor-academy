// EventDetailsModal.jsx
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaTimes } from 'react-icons/fa';

export default function EventDetailsModal({ event, onClose, onUpdateEvent }) {
  const { id, title, start, end, extendedProps } = event;
  const { subject, tutor, feedbackSubmitted, feedback, joinUrl, files = [] } = extendedProps;
  const isPast = start < new Date();

  // Local state for feedback text (if submitting) and notes
  const [feedbackText, setFeedbackText] = useState(feedback || '');
  const [notes, setNotes] = useState('');  // student's personal notes (could be persisted elsewhere)

  // Dropzone setup for file uploads
  const onDrop = (acceptedFiles) => {
    // Update the event's files list (in a real app, upload files to server here)
    const fileInfoList = acceptedFiles.map(file => ({ name: file.name, size: file.size }));
    onUpdateEvent(id, { extendedProps: { files: [...files, ...fileInfoList] } });
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // Handle feedback form submission
  const submitFeedback = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      alert("Please enter your feedback before submitting.");
      return;
    }
    // Update feedback in the main events list
    onUpdateEvent(id, { extendedProps: { feedbackSubmitted: true, feedback: feedbackText.trim() } });
    onClose();
  };

  // Handle session cancellation (for upcoming events)
  const cancelSession = () => {
    if (window.confirm("Are you sure you want to cancel this session?")) {
      // Remove event from list
      onUpdateEvent(id, {});  // Could signal removal; in practice, filter it out in parent
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        {/* Modal close button */}
        <button className="modal-close" onClick={onClose}><FaTimes /></button>

        {/* Modal Header with basic info */}
        <div className="modal-header">
          <h2>{title}</h2>
          <p>
            <strong>Subject:</strong> {subject} &nbsp;|&nbsp; <strong>Tutor:</strong> {tutor}<br/>
            <strong>When:</strong> {start.toLocaleString()} – {end.toLocaleTimeString()}
          </p>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Upcoming session actions */}
          {!isPast && (
            <div className="upcoming-actions">
              <a href={joinUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Join Session
              </a>
              <button className="btn btn-outline" onClick={cancelSession}>Cancel Session</button>
            </div>
          )}

          {/* Past session feedback form or display */}
          {isPast && (
            <div className="feedback-section">
              <h3>Session Feedback</h3>
              {feedbackSubmitted ? (
                <p><em>Feedback submitted:</em> {feedback}</p>
              ) : (
                <form onSubmit={submitFeedback} className="feedback-form">
                  <textarea 
                    rows="3" 
                    value={feedbackText} 
                    onChange={(e) => setFeedbackText(e.target.value)} 
                    placeholder="Leave your feedback about the session..." 
                  />
                  <button type="submit" className="btn btn-primary">Submit Feedback</button>
                </form>
              )}
            </div>
          )}

          {/* Notes section (always available for student to edit) */}
          <div className="notes-section">
            <h3>Your Notes</h3>
            <textarea 
              rows="2" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Write any personal notes or reminders..." 
            />
            {/* In a real app, these notes might be saved to user profile or local storage */}
          </div>

          {/* File attachments section */}
          <div className="files-section">
            <h3>Session Files</h3>
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here...</p>
              ) : (
                <p>Drag & drop files here, or click to select files</p>
              )}
            </div>
            {/* List of attached files (names) */}
            {files.length > 0 && (
              <ul className="file-list">
                {files.map((file, idx) => (
                  <li key={idx}><span role="img" aria-label="attachment">📎</span> {file.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
