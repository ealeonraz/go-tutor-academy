import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import FeedbackModal from './FeedbackModal.jsx';

import './Calendar.css';

export default function Calendar() {
  // State for events and modal visibility
  const [currentEvents, setCurrentEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);     // { start, end, allDay }
  const [selectedEvent, setSelectedEvent] = useState(null);   // for cancel or feedback
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const eventIdCounter = useRef(0);

  // When user selects a slot to book
  const handleSelect = (selectInfo) => {
    const { start, end, allDay } = selectInfo;
    setSelectedSlot({ start, end, allDay });
    setShowBookingModal(true);
    selectInfo.view.calendar.unselect();
  };

  // When user clicks an event (past → feedback, future → cancel)
  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    const isPast = event.start < new Date();
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      extendedProps: { ...event.extendedProps }
    });

    if (isPast) {
      if (!event.extendedProps.feedbackSubmitted) {
        setShowFeedbackModal(true);
      } else {
        alert('Feedback already submitted for this session.');
      }
    } else {
      setShowCancelModal(true);
    }
  };

  // When an event is dragged or resized
  const handleEventChange = (changeInfo) => {
    const updated = changeInfo.event;
    setCurrentEvents(prev =>
      prev.map(ev =>
        ev.id === updated.id
          ? { ...ev, start: updated.start, end: updated.end }
          : ev
      )
    );
  };

  // Add or edit an event from BookingModal
  const addNewEvent = (title, isRecurring) => {
    if (!selectedSlot) return;
    const { start, end, allDay } = selectedSlot;
    const newId = String(eventIdCounter.current++);
    const newEvent = { id: newId, title: title || 'Tutoring Session', extendedProps: { feedbackSubmitted: false } };

    if (isRecurring) {
      newEvent.rrule = {
        freq: 'weekly',
        interval: 1,
        dtstart: start.toISOString().replace(/\.\d{3}Z$/, ''),
        count: 4
      };
      const diffMin = Math.floor((end - start) / (1000 * 60));
      const hours = Math.floor(diffMin / 60);
      const minutes = diffMin % 60;
      const pad = n => String(n).padStart(2, '0');
      newEvent.duration = `${pad(hours)}:${pad(minutes)}`;
      newEvent.groupId = `grp_${newId}`;
    } else {
      newEvent.start = start;
      newEvent.end = end;
      newEvent.allDay = allDay;
    }

    setCurrentEvents(prev => [...prev, newEvent]);
    setShowBookingModal(false);
    setSelectedSlot(null);
  };

  // Cancel an upcoming event
  const cancelEvent = () => {
    if (!selectedEvent) return;
    setCurrentEvents(prev => prev.filter(ev => ev.id !== selectedEvent.id));
    setShowCancelModal(false);
    setSelectedEvent(null);
  };

  // Submit feedback for a past event
  const submitFeedback = (feedbackText) => {
    if (!selectedEvent) return;
    setCurrentEvents(prev =>
      prev.map(ev =>
        ev.id === selectedEvent.id
          ? {
              ...ev,
              extendedProps: {
                ...ev.extendedProps,
                feedbackSubmitted: true,
                feedback: feedbackText
              }
            }
          : ev
      )
    );
    setShowFeedbackModal(false);
    setSelectedEvent(null);
  };

  return (
    <div className="calendar-section">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}  // No rrulePlugin
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek,dayGridMonth'
        }}
        scrollTime="06:00:00"      // scroll to 6 AM on load
        allDaySlot={false}
        selectable={true}
        editable={true}
        eventResizableFromStart={true}
        selectMirror={true}
        dayMaxEvents={true}
        events={currentEvents}
        select={handleSelect}
        eventClick={handleEventClick}
        eventDrop={handleEventChange}
        eventResize={handleEventChange}

        // Event rendering customization
        eventRender={(info) => {
          const { title, start } = info.event;
          const formattedTime = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          const eventElement = info.el;
          const eventText = `
            <div>
              <strong>${title}</strong>
              <br />
              <span>${formattedTime}</span>
            </div>
          `;
          
          // Adding the text to the event's HTML element
          eventElement.innerHTML = eventText;
        }}
      />

      {showFeedbackModal && selectedEvent && (
        <FeedbackModal
          event={selectedEvent}
          onClose={() => { setShowFeedbackModal(false); setSelectedEvent(null); }}
          onSubmit={submitFeedback}
        />
      )}

      {showCancelModal && selectedEvent && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowCancelModal(false)}>
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowCancelModal(false)}>
              &times;
            </button>
            <div className="modal-header">
              <h2>Cancel Appointment</h2>
            </div>
            <p>
              Are you sure you want to cancel your appointment{' '}
              <strong>{selectedEvent.title}</strong> on{' '}
              {selectedEvent.start.toLocaleString()}?
            </p>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={cancelEvent}>
                Yes, Cancel
              </button>
              <button className="btn" onClick={() => setShowCancelModal(false)}>
                No, Keep
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
