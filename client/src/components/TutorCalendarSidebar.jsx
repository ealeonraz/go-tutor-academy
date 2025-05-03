import React, { useState, useEffect } from 'react'; 
import { FaCalendarAlt, FaChalkboardTeacher, FaStickyNote, FaEdit, FaTrashAlt } from 'react-icons/fa'; 
import EditScheduleForm from './EditSchedule.jsx';  // Import the new EditScheduleForm
import Feedback from './Feedback/Feedback.jsx'; 
import './TutorCalendarSidebar.css'; 
import { useAuth } from '../context/AuthContext.jsx'; 
import ManageSubjects from './ManageSubjects.jsx';


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
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State for delete confirmation modal
  const [selectedAppointment, setSelectedAppointment] = useState(null); // Track the selected appointment to delete

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


    

  const handleOpenFeedback = (ev) => {     
    setFeedbackEvent(ev);     
    setShowFeedbackModal(true);   
  };    

  const handleManageSubjects = () => {     
    setManageSubjectsVisible(prev => !prev);   
  };    

  // Handle delete confirmation modal open
  const handleDeleteConfirmation = (appointment) => {
    console.log("I AM HERE")
    setSelectedAppointment(appointment);  // Store the selected appointment
    setShowDeleteConfirmation(true); // Show the delete confirmation modal
  };

  // Handle the delete appointment logic
  const handleDeleteAppointment = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/appointments/${selectedAppointment._id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert('Appointment deleted successfully');
        onCancelAppointment(selectedAppointment); // Remove the appointment from the UI
      } else {
        alert('Failed to delete appointment');
      }
    } catch (err) {
      console.error('Error deleting appointment:', err);
      alert('Error deleting appointment');
    } finally {
      setShowDeleteConfirmation(false); // Close the modal after the action
    }
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
                  onClick={() => handleDeleteConfirmation(ev)} // Trigger delete confirmation
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

      {/* Manage Subjects */}
      {manageSubjectsVisible && (
        <ManageSubjects onClose={() => setManageSubjectsVisible(false)} />
      )}


      {/* Appointment Create/Edit Modal */}
      {showCreateModal && (
        <EditScheduleForm
          tutorId={user.id} // Pass the tutor ID to fetch the availability
          initialData={newEventData}
          onClose={() => setShowCreateModal(false)}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="confirmation-modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <p>Are you sure you want to delete this appointment?</p>
            <button onClick={handleDeleteAppointment}>Yes, Delete</button>
            <button onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
          </div>
        </div>
      )}

    </aside>
  );
}
