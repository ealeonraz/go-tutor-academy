import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import CalendarSidebar from '../components/TutorCalendarSidebar.jsx';
import EventDetailsModal from '../components/Modals/EventDetailsModal.jsx';
import ScheduleEditForm from '../components/ScheduleEditForm.jsx'; // New component for editing schedule
import ManageSubjects from '../components/ManageSubjects.jsx'; // New component for managing subjects
import Header from '../components/Navbars/LoggedInNavbar.jsx';
import DashboardNavbar from '../components/Navbars/DashboardNavbar.jsx';
import LoggedInNavbar from '../components/Navbars/LoggedInNavbar.jsx'

export default function TutorDashboardCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEventData, setNewEventData] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch appointments for the tutor from the database
  useEffect(() => {
    fetch("http://localhost:4000/api/appointments/me", {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then((res) => res.json())  // Parse as JSON
      .then((data) => {
        console.log("Fetched tutor appointments:", data); // Log the fetched data
        setEvents(data);  // Set the events state
      })
      .catch((error) => console.error("Unable to fetch appointments for tutor:", error));
  }, [token]);

  // Log the events state when it's updated
  useEffect(() => {
    console.log("Events state:", events);  // Log events state
  }, [events]);

  const handleSelectEvent = (eventInfo) => {
    let eventData = eventInfo;
    if (eventInfo.event) {
      const ev = eventInfo.event;
      eventData = {
        id: ev.id,
        title: ev.title,
        start: ev.start,
        end: ev.end,
        extendedProps: { ...ev.extendedProps }
      };
    }
    setSelectedEvent(eventData);
  };

  const updateEvent = (eventId, newProps) => {
    setEvents(prevEvents =>
      prevEvents.map(ev =>
        ev.id === eventId
          ? { ...ev, ...newProps, extendedProps: { ...ev.extendedProps, ...newProps.extendedProps } }
          : ev
      )
    );
  };

  const deleteEvent = async (eventId) => {
    try {
      // Send DELETE request to the backend
      const response = await fetch(`http://localhost:4000/api/appointments/${eventId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert('Appointment deleted successfully');
        setEvents(prevEvents => prevEvents.filter(ev => ev.id !== eventId)); // Update state
        setSelectedEvent(null); // Clear selected event
      } else {
        alert('Failed to delete appointment');
      }
    } catch (err) {
      console.error('Error deleting appointment:', err);
      alert('Error deleting appointment');
    }
  };

  const handleDateSelect = (selectInfo) => {
    setNewEventData({
      title: '',
      start: selectInfo.start,
      end: selectInfo.end,
      extendedProps: {
        subject: '',
        student: '',
        feedbackSubmitted: false,
        feedback: '',
        joinUrl: '',
        files: []
      }
    });
    setShowCreateModal(true);
  };

  const handleOpenCreate = (ev = null) => {     
    if (ev) {       
      setNewEventData(ev);  // Populate data for the existing appointment
    } else {       
      const start = new Date();       
      setNewEventData({         
        title: '',         
        start,         
        end: new Date(start.getTime() + 60*60*1000),         
        extendedProps: { feedbackSubmitted: false },       
        _id: '', // Ensure you include the placeholder for _id in case of new appointment
      });     
    }     
    setShowCreateModal(true);   
  };
  

  const handleCreateAppointment = (appointmentData) => {
    const newId = String(events.length + 1);
    setEvents(prevEvents => [
      ...prevEvents,
      { id: newId, ...appointmentData }
    ]);
    setShowCreateModal(false);
  };

  return (
    <div className="dashboard-page">
      <LoggedInNavbar />
      <DashboardNavbar />
      <div className="dashboard-content">
        <div className="header-section">
          <h1>Your Calendar</h1>
          <p>Manage your tutoring sessions and view upcoming appointments.</p>
        </div>

        <div className="main-content">
          <CalendarSidebar events={events} onSelectEvent={handleSelectEvent} />
          <div className="calendar-panel">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek'
              }}
              selectable={true}
              select={handleDateSelect}
              nowIndicator={true}
              allDaySlot={false}
              height="auto"
              events={events}
              eventClassNames={(info) => {
                const { subject, feedbackSubmitted } = info.event.extendedProps;
                const isPast = info.event.start < new Date();
                let classes = [];
                if (subject) classes.push(`event-${subject.toLowerCase()}`);
                if (isPast) classes.push('past-event');
                else classes.push('upcoming-event');
                if (isPast && !feedbackSubmitted) classes.push('feedback-pending');
                return classes;
              }}
              eventContent={(info) => {
                const { feedbackSubmitted, subject } = info.event.extendedProps; // Extract subject and feedbackSubmitted
                const isPast = info.event.start < new Date();
                let statusIcon = null;
                if (isPast) {
                  statusIcon = feedbackSubmitted ? '✅' : '🕒';
                }
                return (
                  <div style={{ display: 'flex', alignItems: 'center' }}> {/* Flexbox for inline items */}
                    <b>{info.timeText}</b>
                    <span style={{ marginLeft: 4 }}>{info.event.title}</span>
                    {subject && <div style={{ marginLeft: 4 }}>{subject}</div>} {/* Add margin for spacing */}
                    {statusIcon && <span style={{ marginLeft: 4 }}>{statusIcon}</span>}
                  </div>
                );
              }}
              eventClick={handleSelectEvent}
            />
          </div>
        </div>
      </div>

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onUpdateEvent={updateEvent}
          onDeleteEvent={() => deleteEvent(selectedEvent.id)} // Delete event
        />
      )}

      {showCreateModal && (
        <AppointmentForm
          initialData={newEventData}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateAppointment}
        />
      )}
    </div>
  );
}
