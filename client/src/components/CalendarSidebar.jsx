import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaEdit, FaTrashAlt, FaStickyNote } from 'react-icons/fa';
import AppointmentForm from './CreateAppointmentModal.jsx';
import Feedback from './Feedback.jsx';
import DeleteConfirmationModal from './DeleteConfirmationModal.jsx'; // Import the confirmation modal
import EditAppointmentForm from './EditAppointmentForm.jsx'; // Import the Edit Appointment form
import './CalendarSidebar.css';
import './calendar.css';
import { useAuth } from '../context/AuthContext.jsx';

export default function CalendarSidebar({
  events = [],
  onSelectEvent = () => {},
  onNewAppointment = () => {},
  onEditAppointment = () => {},
  onCancelAppointment = () => {},
  onSeeAll = () => {}
}) {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEventData, setNewEventData] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackEvent, setFeedbackEvent] = useState(null);
  const [appointments, setAppointments] = useState([]); // Assuming it's an array of appointments
  const [showAllPrevious, setShowAllPrevious] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);

  const [tutorTimes, setTutorTimes] = useState([]);  // <-- Define tutorTimes state here
  // State for delete confirmation modal
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null); // Store the event to delete

  // State for edit appointment modal
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch appointments (already in place)
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:4000/api/appointments", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setAppointments(data);
        } else {
          console.error("Error: Data is not an array", data);
        }
      } catch (err) {
        console.error("Error fetching appointments", err);
      }
    };

    fetchAppointments();
  }, []); // Run once on component mount

  // Fetch notes using useEffect
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:4000/api/tutor-notes", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });
        const data = await response.json();
        setNotes(data); // Set the notes data
      } catch (error) {
        console.error("Error fetching notes", error);
      }
    };
    fetchNotes();
  }, []); // Run once on component mount

  const now = new Date();
  
  // Make sure appointments is an array and filter safely
  const upcoming = Array.isArray(appointments)
    ? appointments
        .filter(ev => ev.start && new Date(ev.start) >= now)  // Check if `start` exists
        .sort((a, b) => new Date(a.start) - new Date(b.start)) // Sort by start date
        .slice(0, 3) // Get the first 3 upcoming appointments
    : [];
  
  const allPrevious = appointments
    .filter(ev => new Date(ev.start) < now)
    .sort((a, b) => new Date(b.start) - new Date(a.start));
  const previous = showAllPrevious ? allPrevious : allPrevious.slice(0, 2);

  const handleOpenCreate = (ev = null) => {
    if (ev) {
      setNewEventData(ev); // Set the selected event data for editing
    } else {
      const start = new Date();
      setNewEventData({
        title: '',
        start,
        end: new Date(start.getTime() + 60 * 60 * 1000),
        extendedProps: { feedbackSubmitted: false }
      });
    }
    setShowCreateModal(true); // Open the modal
  };

  const handleSaveAppointment = data => {
    onNewAppointment(data);
    setShowCreateModal(false);
  };

  const handleOpenFeedback = ev => {
    setFeedbackEvent(ev);
    setShowFeedbackModal(true);
  };

  const handleDeleteConfirmation = (event) => {
    setEventToDelete(event);  // Store the event to delete
    setShowDeleteConfirmation(true);  // Show the confirmation modal
  };

  // Delete appointment (after confirmation)
  const handleDeleteAppointment = async (event) => {
    if (!event || !event._id) {
      console.error("No event selected for deletion. eventToDelete:", event);
      alert("Error: Missing event ID");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/appointments/${event._id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert('Appointment deleted successfully');
        setAppointments(prevAppointments => prevAppointments.filter(ev => ev._id !== event._id)); // Update state
        setShowDeleteConfirmation(false); // Close confirmation modal
        setEventToDelete(null); // Clear the event to delete
      } else {
        alert('Failed to delete appointment');
        setShowDeleteConfirmation(false); // Close confirmation modal on failure
      }
    } catch (err) {
      console.error('Error deleting appointment:', err);
      alert('Error deleting appointment');
      setShowDeleteConfirmation(false); // Close confirmation modal on error
    }
  };

  // Open the Edit modal with the selected event
  const handleEditAppointment = (ev) => {
    console.log("Editing Appointment: ", ev); // Log the event data you are passing to EditAppointmentForm
    setNewEventData(ev);  // Set the data for the appointment to edit
    setSelectedTutor(ev.tutor);  // Set the selected tutor for this appointment
  
    // Fetch tutor's available times from the backend when editing
    const fetchTutorTimes = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/tutors", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        const data = await response.json();
        console.log("Fetched Tutor Times:", data); // Check the fetched tutor availability
        setTutorTimes(data); // Set tutor's available times
      } catch (err) {
        console.error("Error fetching tutor availability:", err);
      }
    };
  
    if (ev.tutor) {
      fetchTutorTimes(); // Fetch the availability if tutor is present
    }
  
    setShowEditModal(true);  // Show the edit modal
  };
  
  

  return (
    <aside className="sidebar">
      <button
        className="new-appointment-button"
        onClick={() => handleOpenCreate(null)}
      >
        + New Appointment
      </button>

      <div className="widget upcoming-widget">
        <h2><FaCalendarAlt /> Upcoming Sessions</h2>
        <ul>
          {upcoming.length > 0 ? upcoming.map(ev => (
            <li key={ev.id || ev._id} className="appointment-item">
              <div
                className="appointment-info"
                onClick={() => onSelectEvent(ev)}
              >
                <span className="appointment-time">
                  {new Date(ev.start).toLocaleString([], {
                    month: 'short', day: 'numeric',
                    hour: 'numeric', minute: '2-digit'
                  })}
                </span>
                <span className="appointment-title">{ev.title}</span>
              </div>
              <div className="appointment-actions">
                <button
                  className="icon-btn"
                  title="Edit"
                  onClick={() => handleEditAppointment(ev)} // Trigger edit
                >
                  <FaEdit />
                </button>
                <button
                  className="icon-btn"
                  title="Cancel"
                  onClick={() => handleDeleteConfirmation(ev)} // Trigger delete confirmation
                >
                  <FaTrashAlt />
                </button>
              </div>
            </li>
          )) : <li>No upcoming sessions</li>}
        </ul>
        <button
          className="see-all-button"
          onClick={() => onSeeAll('upcoming')}
        >
          See All Upcoming
        </button>
      </div>

      <div className="widget recent-widget">
        <h2><FaCalendarAlt /> Previous Sessions</h2>
        <ul>
          {previous.length > 0 ? previous.map(ev => (
            <li key={ev.id || ev._id} className="appointment-item past">
              <div
                className="appointment-info"
                onClick={() => onSelectEvent(ev)}
              >
                <span className="appointment-time past-time">
                  {new Date(ev.start).toLocaleString([], {
                    month: 'short', day: 'numeric',
                    hour: 'numeric', minute: '2-digit'
                  })}
                </span>
                <span className="appointment-title">{ev.title}</span>
              </div>
              <div className="appointment-actions">
                <button
                  className="feedback-button"
                  onClick={() => handleOpenFeedback(ev)}
                >
                  Leave Feedback
                </button>
              </div>
            </li>
          )) : <li>No previous sessions</li>}
        </ul>
        <button
          className="see-all-button"
          onClick={() => setShowAllPrevious(prev => !prev)}
        >
          {showAllPrevious ? "Show Less" : "See All Previous"}
        </button>
      </div>

      <div className="widget notes-widget">
        <h2><FaStickyNote /> Notes</h2>
        <ul>
          {notes.length > 0 ? notes.map(note => (
            <li key={note._id.toString()} className="note-item">
              <div className="note-info">
                <span className="note-tutor-notes">{note.tutorNotes}</span>
              </div>
            </li>
          )) : <li>No notes</li>}
        </ul>
        <button
          className="see-all-button"
          onClick={() => navigate('/student-dashboard/notes')} // Navigate to /notes
        >
          See All Notes
        </button>
      </div>

      {/* Appointment Create/Edit Modal */}
      {showCreateModal && (
        <AppointmentForm
          initialData={newEventData}
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveAppointment}
        />
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && feedbackEvent && (
        <Feedback
          appointment={feedbackEvent}
          user={user}
          onClose={() => setShowFeedbackModal(false)}
        />
      )}

      {/* Edit Appointment Modal */}
      {showEditModal && newEventData && (
        <EditAppointmentForm
          initialData={newEventData}
          onClose={() => setShowEditModal(false)}  // Close the modal
          onSave={(updatedData) => {
            onEditAppointment(updatedData); // Update the parent with the edited data
            setShowEditModal(false); // Close the modal after saving
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && eventToDelete && (
        <DeleteConfirmationModal
          event={eventToDelete}
          onDelete={handleDeleteAppointment}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}
    </aside>
  );
}
