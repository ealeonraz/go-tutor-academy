import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaChalkboardTeacher, FaStickyNote, FaEdit, FaTrashAlt } from 'react-icons/fa';
import AppointmentForm from './CreateAppointmentModal.jsx';
import Feedback from './Feedback.jsx';
import './TutorCalendarSidebar.css';  // Updated to a different CSS file
import { useAuth } from '../context/AuthContext.jsx';

export default function TutorSidebar({
  events = [],
  onSelectEvent = () => {},
  onEditAppointment = () => {},
  onCancelAppointment = () => {},
  onSeeAll = () => {}
}) {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEventData, setNewEventData] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackEvent, setFeedbackEvent] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showAllPrevious, setShowAllPrevious] = useState(false);
  const [manageSubjectsVisible, setManageSubjectsVisible] = useState(false); 
  const token = localStorage.getItem("token");

  // Fetch tutor's appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:4000/api/tutors/appointments", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });
        const data = await response.json();
  
        // Ensure data is an array before calling .filter()
        if (Array.isArray(data)) {
          setAppointments(data);
        } else {
          console.error("Error: Data is not an array", data);
          setAppointments([]); // Set it to an empty array in case of error
        }
      } catch (err) {
        console.error("Error fetching appointments", err);
        setAppointments([]); // Set to empty array on error
      }
    };
  
    fetchAppointments();
  }, []);
  

  const now = new Date();

  const upcoming = appointments
    .filter(ev => ev.start && new Date(ev.start) >= now)
    .sort((a, b) => new Date(a.start) - new Date(b.start)) 
    .slice(0, 3);

  const allPrevious = appointments
    .filter(ev => new Date(ev.start) < now)
    .sort((a, b) => new Date(b.start) - new Date(a.start));

  const previous = showAllPrevious ? allPrevious : allPrevious.slice(0, 2);

  const handleOpenCreate = (ev = null) => {
    if (ev) {
      setNewEventData(ev);
    } else {
      const start = new Date();
      setNewEventData({
        title: '',
        start,
        end: new Date(start.getTime() + 60*60*1000),
        extendedProps: { feedbackSubmitted: false }
      });
    }
    setShowCreateModal(true);
  };

  const handleSaveAppointment = (data) => {
    onEditAppointment(data);
    setShowCreateModal(false);
  };

  const handleOpenFeedback = (ev) => {
    setFeedbackEvent(ev);
    setShowFeedbackModal(true);
  };

  const handleManageSubjects = () => {
    setManageSubjectsVisible(prev => !prev);
  };

  return (
    <aside className="tutor-sidebar">
      {/* Edit My Schedule Button */}
      <button
        className="tutor-action-button"
        onClick={handleOpenCreate}
      >
        Edit My Schedule
      </button>

      {/* Manage My Subjects Button */}
      <button
        className="tutor-action-button"
        onClick={handleManageSubjects}
      >
        <FaChalkboardTeacher /> Manage My Subjects
      </button>

      <div className="tutor-widget tutor-upcoming-widget">
        <h2><FaCalendarAlt /> Upcoming Sessions</h2>
        <ul>
          {upcoming.length > 0 ? upcoming.map(ev => (
            <li key={ev.id} className="tutor-appointment-item">
              <div
                className="tutor-appointment-info"
                onClick={() => onSelectEvent(ev)}
              >
                <span className="tutor-appointment-time">
                  {new Date(ev.start).toLocaleString([],{
                    month:'short', day:'numeric',
                    hour:'numeric', minute:'2-digit'
                  })}
                </span>
                <span className="tutor-appointment-title">{ev.title}</span>
              </div>
              <div className="tutor-appointment-actions">
                <button
                  className="icon-btn"
                  title="Edit"
                  onClick={() => { onEditAppointment(ev); handleOpenCreate(ev); }}
                >
                  <FaEdit />
                </button>
                <button
                  className="icon-btn"
                  title="Cancel"
                  onClick={() => onCancelAppointment(ev)}
                >
                  <FaTrashAlt />
                </button>
              </div>
            </li>
          )) : <li>No upcoming sessions</li>}
        </ul>
        <button
          className="tutor-see-all-button"
          onClick={() => onSeeAll('upcoming')}
        >
          See All Upcoming
        </button>
      </div>

      <div className="tutor-widget tutor-feedback-widget">
        <h2><FaStickyNote /> Feedback Received</h2>
        <ul>
          {previous.length > 0 ? previous.map(ev => (
            <li key={ev.id} className="tutor-appointment-item past">
              <div
                className="tutor-appointment-info"
                onClick={() => onSelectEvent(ev)}
              >
                <span className="tutor-appointment-time past-time">
                  {new Date(ev.start).toLocaleString([],{
                    month:'short', day:'numeric',
                    hour:'numeric', minute:'2-digit'
                  })}
                </span>
                <span className="tutor-appointment-title">{ev.title}</span>
              </div>
              <div className="tutor-appointment-actions">
                <button
                  className="tutor-feedback-button"
                  onClick={() => handleOpenFeedback(ev)}
                >
                  Leave Feedback
                </button>
              </div>
            </li>
          )) : <li>No feedback available</li>}
        </ul>
        <button
          className="tutor-see-all-button"
          onClick={() => setShowAllPrevious(prev => !prev)}
        >
          {showAllPrevious ? "Show Less" : "See All Previous"}
        </button>
      </div>

      {/* Manage Subjects */}
      {manageSubjectsVisible && (
        <div className="tutor-widget tutor-manage-subjects-widget">
          <h2><FaChalkboardTeacher /> Manage Subjects</h2>
          <ManageSubjects subjects={subjects} />
        </div>
      )}

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
    </aside>
  );
}
