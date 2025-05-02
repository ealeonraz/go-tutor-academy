import React, { useState, useEffect } from 'react';
import './CreateAppointment.css';

export default function CreateAppointmentModal({ onClose, onSave }) {
  const [tutors, setTutors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");
  const [tutor, setTutor] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [customMode, setCustomMode] = useState(false);
  const [customDateTime, setCustomDateTime] = useState("");
  const [customDuration, setCustomDuration] = useState("");
  const [appointmentMode, setAppointmentMode] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const token = localStorage.getItem("token");

  // Fetch tutors and subjects
  useEffect(() => {
    const fetchTutorsAndSubjects = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/tutors", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setTutors(data);
        // Get unique subjects across all tutors
        const uniqueSubjects = [...new Set(data.flatMap(t => t.subjects || []))];
        setSubjects(uniqueSubjects);
      } catch (err) {
        console.error("Error fetching tutors/subjects:", err);
      }
    };
    fetchTutorsAndSubjects();
  }, [token]);

  // Handle subject change
  useEffect(() => {
    setTutor("");
    setAvailableSlots([]);
    setSelectedSlot("");
    setCustomMode(false);
  }, [subject]);

  // Handle tutor selection and get available time slots
  useEffect(() => {
    if (tutor) {
      const selectedTutor = tutors.find(t => t._id === tutor);
      const tutorSlots = selectedTutor?.availableHours || [];

      // Flatten the available hours for each tutor and display all available slots
      const slots = tutorSlots.map(slot => {
        if (Array.isArray(slot.hours)) {
          return {
            day: slot.day,
            hours: slot.hours.map(hour => ({
              start: new Date(hour.start),
              end: new Date(hour.end),
            }))
          };
        } else {
          return null;
        }
      }).filter(Boolean); // Filter out any invalid slots

      setAvailableSlots(slots);
      setSelectedSlot("");
      setCustomMode(false);
    }
  }, [tutor, tutors]);

  const handleNext = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let startTime, duration;
    if (!customMode) {
      startTime = new Date(selectedSlot);  // Ensure selectedSlot is a valid Date object
      duration = 60;  // Default duration if no custom time is requested
    } else {
      startTime = new Date(customDateTime);  // Ensure customDateTime is a valid Date object
      duration = parseInt(customDuration, 10) || 60;
    }
  
    const endTime = new Date(startTime.getTime() + duration * 60000);
  
    // Format dates as ISO strings in the format fullCalendar likes
    const formattedStart = startTime.toISOString();  // Format to ISO 8601 string
    const formattedEnd = endTime.toISOString();  // Format to ISO 8601 string
  
    const appointmentData = {
      subject,
      tutor,
      start: formattedStart,
      end: formattedEnd,
      extendedProps: {
        appointmentMode,
        additionalNotes,
        feedbackSubmitted: false,
        feedback: "",
        joinUrl: "",
        files: [],
      },
    };
  
    // Submit the appointment data
    onSave(appointmentData);
    setSubmitted(true);
  
    try {
      const response = await fetch("http://localhost:4000/api/appointments/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });
  
      if (!response.ok) {
        throw new Error("Unable to create appointment");
      }
  
      const res = await response.json();
    } catch (err) {
      console.error(err);
    }
  };
  

  const handleTutorChange = (e) => {
    setTutor(e.target.value);
  };

  const handleSlotSelection = (slot) => {
    setSelectedSlot(slot);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="appointment-form-step">
            <h2>Basic Appointment Info</h2>
            <div className="appointment-form-group">
              <label htmlFor="subject">Subject *</label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              >
                <option value="">--Select subject--</option>
                {subjects.map((sub, index) => (
                  <option key={index} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div className="appointment-form-group">
              <label htmlFor="tutor">Tutor *</label>
              <select
                id="tutor"
                value={tutor}
                onChange={handleTutorChange}
                required
                disabled={!subject}
              >
                <option value="">--Select tutor--</option>
                {tutors
                  .filter((t) => t.subjects.includes(subject))
                  .map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.firstName} {t.lastName}
                    </option>
                  ))}
              </select>
            </div>

            {tutor && !customMode && (
              <div className="appointment-form-group">
                <p><strong>Available Time Slots:</strong></p>
                {availableSlots.length === 0 ? (
                  <p>No slots available. You may request a custom time.</p>
                ) : (
                  <div className="time-slot-container">
                    {availableSlots.map((slot, index) => (
                      <div key={index}>
                        <div className="time-slot-cards">
                          {slot.hours.map((hour, i) => {
                            const startDate = hour.start;
                            const endDate = hour.end;
                            const dayName = startDate.toLocaleString([], { weekday: 'long' });
                            const formattedStart = startDate.toLocaleString([], { hour: '2-digit', minute: '2-digit' });
                            const formattedEnd = endDate.toLocaleString([], { hour: '2-digit', minute: '2-digit' });
                            return (
                              <div
                                key={i}
                                className={`time-slot-card ${selectedSlot === hour.start ? "selected" : ""}`}
                                onClick={() => handleSlotSelection(hour.start)}
                              >
                                <span className="time-slot-time">
                                  {dayName}, {formattedStart} - {formattedEnd}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  className="appointment-btn request-custom-time-btn"
                  onClick={() => setCustomMode(true)}
                >
                  Request Custom Time
                </button>
              </div>
            )}

            {customMode && (
              <div className="appointment-form-group">
                <p><strong>Custom Time Request:</strong></p>
                <label htmlFor="customDateTime">Preferred Date & Time *</label>
                <input
                  type="datetime-local"
                  id="customDateTime"
                  value={customDateTime}
                  onChange={(e) => setCustomDateTime(e.target.value)}
                  required
                />
                <label htmlFor="customDuration">Duration (mins) *</label>
                <input
                  type="number"
                  id="customDuration"
                  placeholder="e.g., 60"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="appointment-button-group">
              <button
                type="button"
                onClick={handleNext}
                className="appointment-btn appointment-next-btn"
                disabled={!tutor || (!customMode && !selectedSlot) || (customMode && (!customDateTime || !customDuration))}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="appointment-form-step">
            <h2>Additional Details</h2>
            <div className="additional-details-card">
              <div className="appointment-form-group mode-selector-group">
                <label className="modern-label">Appointment Mode *</label>
                <div className="pill-button-group">
                  <button
                    type="button"
                    className={`pill-button ${appointmentMode === "Online" ? "selected" : ""}`}
                    onClick={() => setAppointmentMode("Online")}
                  >
                    Online
                  </button>
                  <button
                    type="button"
                    className={`pill-button ${appointmentMode === "In-Person" ? "selected" : ""}`}
                    onClick={() => setAppointmentMode("In-Person")}
                  >
                    In-Person
                  </button>
                </div>
              </div>
              <div className="appointment-form-group">
                <label className="modern-label" htmlFor="additionalNotes">
                  Additional Notes
                </label>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  placeholder="Any specific requests or information..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                ></textarea>
              </div>
              <div className="appointment-button-group">
                <button
                  type="button"
                  onClick={handleBack}
                  className="appointment-btn appointment-back-btn"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="appointment-btn appointment-submit-btn"
                  disabled={!appointmentMode}
                >
                  Create Appointment
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <div className="feedback-page">
        <div className="success-card">
          <div className="checkmark-container">
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
          <h2>Appointment Created!</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-page">
      <div className="appointment-card">
        <button className="appointment-close-btn" onClick={onClose}>
          ×
        </button>
        <div className="appointment-progress-bar">
          <div className="appointment-progress" style={{ width: `${(currentStep / 2) * 100}%` }}></div>
        </div>
        <form onSubmit={handleSubmit}>{renderStep()}</form>
      </div>
    </div>
  );
}
