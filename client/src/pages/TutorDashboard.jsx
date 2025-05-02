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

export default function TutorDashboardCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newEventData, setNewEventData] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [manageSubjectsVisible, setManageSubjectsVisible] = useState(false); // Add state for visibility
  const token = localStorage.getItem("token");

  // Fetch appointments and tutor's subjects from the backend

  // Function to handle event selection for viewing or editing
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

  // Handle opening schedule edit modal
  const handleOpenScheduleModal = () => {
    setShowScheduleModal(true);
  };

  const handleCloseScheduleModal = () => {
    setShowScheduleModal(false);
  };

  const handleCreateAppointment = (appointmentData) => {
    setEvents(prevEvents => [
      ...prevEvents,
      { id: new Date().getTime(), ...appointmentData }
    ]);
    setShowScheduleModal(false);
  };

  // Toggle the visibility of the ManageSubjects component
  const toggleManageSubjects = () => {
    setManageSubjectsVisible(prevState => !prevState);
  };

  return (
    <div className="dashboard-page">
      <Header />
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
              select={handleSelectEvent}
              nowIndicator={true}
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



        {selectedEvent && (
          <EventDetailsModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}

      </div>
    </div>
  );
}
