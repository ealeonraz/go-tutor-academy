import React, { useState, useEffect } from 'react';
import StudentDashboardNavbar from '../components/DashboardNavbar.jsx';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import CalendarSidebar from '../components/CalendarSidebar.jsx';
import EventDetailsModal from '../components/EventDetailsModal.jsx';
import AppointmentForm from '../components/CreateAppointmentModal.jsx';
import './StudentDashboardCalendar.css';

export default function StudentDashboardCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEventData, setNewEventData] = useState(null);

  const token = localStorage.getItem("token");
  
  // Fetch appointments from the database
  useEffect(() => {
    fetch("http://localhost:4000/api/appointments", {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then((res) => res.json())  // Parse as JSON
      .then((data) => {
        console.log("Fetched data:", data); // Log the full data returned from the API
        setEvents(data);  // Set the events state
      })
      .catch((error) => console.error("Unable to fetch appointments:", error));
  }, []);
  
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

  const deleteEvent = (eventId) => {
    setEvents(prevEvents => prevEvents.filter(ev => ev.id !== eventId));
    setSelectedEvent(null);
  };

  const handleDateSelect = (selectInfo) => {
    setNewEventData({
      title: '',
      start: selectInfo.start,
      end: selectInfo.end,
      extendedProps: {
        subject: '',
        tutor: '',
        feedbackSubmitted: false,
        feedback: '',
        joinUrl: '',
        files: []
      }
    });
    setShowCreateModal(true);
  };

  const handleOpenCreateModal = () => {
    const now = new Date();
    setNewEventData({
      title: '',
      start: now,
      end: new Date(now.getTime() + 60 * 60 * 1000),
      extendedProps: {
        subject: '',
        tutor: '',
        feedbackSubmitted: false,
        feedback: '',
        joinUrl: '',
        files: []
      }
    });
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
      <StudentDashboardNavbar />
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
                const { feedbackSubmitted } = info.event.extendedProps;
                const isPast = info.event.start < new Date();
                let statusIcon = null;
                if (isPast) {
                  statusIcon = feedbackSubmitted ? '✅' : '🕒';
                }
                return (
                  <div>
                    <b>{info.timeText}</b>{" "}
                    <span>{info.event.title}</span>
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
          onDeleteEvent={deleteEvent}
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
