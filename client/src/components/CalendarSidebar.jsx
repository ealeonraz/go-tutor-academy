import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaEdit, FaTrashAlt, FaStickyNote } from 'react-icons/fa';
import AppointmentForm from './CreateAppointmentModal.jsx';
import Feedback from './Feedback.jsx';
import './Calendar.css';

export default function CalendarSidebar({
  events = [],
  onSelectEvent = () => {},
  onNewAppointment = () => {},
  onEditAppointment = () => {},
  onCancelAppointment = () => {},
  onSeeAll = () => {}
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEventData, setNewEventData] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackEvent, setFeedbackEvent] = useState(null);
  const [appointments, setAppointments] = useState([]);  // Assuming it's an array of appointments

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:4000/api/appointments", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });
        const data = await response.json();
        console.log(data)
        if (Array.isArray(data)) {
          setAppointments(data); // Make sure data is an array
        } else {
          console.error("Error: Data is not an array", data);
        }
      } catch (err) {
        console.error("Error fetching appointments", err);
      }
    };
  
    fetchAppointments();
  }, []); // Run once on component mount
  
  const now = new Date();
  
  // Make sure appointments is an array and filter safely
  const upcoming = Array.isArray(appointments)
    ? appointments
        .filter(ev => ev.start && new Date(ev.start) >= now)  // Check if `start` exists
        .sort((a, b) => new Date(a.start) - new Date(b.start)) // Sort by start date
        .slice(0, 3) // Get the first 3 upcoming appointments
    : [];
  
  

  // last week’s recent
  const oneWeekAgo = new Date(now.getTime() - 7*24*60*60*1000);
  const recent = appointments
    .filter(ev => {
      const d = new Date(ev.start);
      return d < now && d >= oneWeekAgo;
    })
    .sort((a,b) => new Date(b.start) - new Date(a.start))
    .slice(0,3);

  // open create/edit appointment
  const handleOpenCreate = (ev = null) => {
    if (ev) {
      setNewEventData(ev);
    } else {
      const start = new Date();
      setNewEventData({
        title: '',
        start,
        end:   new Date(start.getTime() + 60*60*1000),
        extendedProps: { feedbackSubmitted:false }
      });
    }
    setShowCreateModal(true);
  };

  // save appointment → delegate out
  const handleSaveAppointment = data => {
    onNewAppointment(data);
    setShowCreateModal(false);
  };

  // open feedback modal
  const handleOpenFeedback = ev => {
    setFeedbackEvent(ev);
    setShowFeedbackModal(true);
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
            <li key={ev.id} className="appointment-item">
              <div
                className="appointment-info"
                onClick={() => onSelectEvent(ev)}
              >
                <span className="appointment-time">
                  {new Date(ev.start).toLocaleString([],{
                    month:'short',day:'numeric',
                    hour:'numeric',minute:'2-digit'
                  })}
                </span>
                <span className="appointment-title">{ev.title}</span>
              </div>
              <div className="appointment-actions">
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
          className="see-all-button"
          onClick={() => onSeeAll('upcoming')}
        >
          See All Upcoming
        </button>
      </div>

      <div className="widget recent-widget">
        <h2><FaCalendarAlt /> Recent Sessions</h2>
        <ul>
          {recent.length > 0 ? recent.map(ev => (
            <li key={ev.id} className="appointment-item past">
              <div
                className="appointment-info"
                onClick={() => onSelectEvent(ev)}
              >
                <span className="appointment-time past-time">
                  {new Date(ev.start).toLocaleString([],{
                    month:'short',day:'numeric',
                    hour:'numeric',minute:'2-digit'
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
          )) : <li>No recent sessions</li>}
        </ul>
        <button
          className="see-all-button"
          onClick={() => onSeeAll('recent')}
        >
          See All Recent
        </button>
      </div>

      <div className="widget notes-widget">
        <h2><FaStickyNote /> Notes</h2>
        <ul>
          <li>No notes</li>
        </ul>
        <button
          className="see-all-button"
          onClick={() => onSeeAll('notes')}
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
          event={feedbackEvent}
          onClose={() => setShowFeedbackModal(false)}
        />
      )}
    </aside>
  );
}
