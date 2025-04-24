import React, { useState, useEffect } from "react";
import "./CreateAppointment.css"; // Uses updated CSS with --app- variables

// Test data for subjects, tutors, and availability
const SUBJECTS = [
  { id: "math", name: "Math" },
  { id: "science", name: "Science" },
  { id: "english", name: "English" }
];

const TUTORS = {
  math: [
    { id: "tutor1", name: "Mr. Alan" },
    { id: "tutor2", name: "Ms. Mary" }
  ],
  science: [{ id: "tutor3", name: "Dr. Blake" }],
  english: [{ id: "tutor4", name: "Ms. Chloe" }]
};

const AVAILABILITY = {
  tutor1: [
    "2025-04-13T10:00:00Z",
    "2025-04-13T11:30:00Z",
    "2025-04-14T09:00:00Z"
  ],
  tutor2: [
    "2025-04-15T14:00:00Z",
    "2025-04-15T15:30:00Z"
  ],
  tutor3: [
    "2025-04-16T13:00:00Z",
    "2025-04-16T14:30:00Z"
  ],
  tutor4: [
    "2025-04-17T09:00:00Z",
    "2025-04-17T10:30:00Z"
  ]
};


export default function CreateAppointmentModal({ onClose, onSave }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [customMode, setCustomMode] = useState(false);

  // Step 1 state variables
  const [subject, setSubject] = useState("");
  const [tutor, setTutor] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  // For custom time requests
  const [customDateTime, setCustomDateTime] = useState("");
  const [customDuration, setCustomDuration] = useState("");

  // Step 2 state variables
  const [appointmentMode, setAppointmentMode] = useState(""); // "Online" or "In-Person"
  const [additionalNotes, setAdditionalNotes] = useState("");

  const token = localStorage.getItem("token");

  // Reset dependent states when subject changes.
  useEffect(() => {
    setTutor("");
    setAvailableSlots([]);
    setSelectedSlot("");
    setCustomMode(false);
  }, [subject]);

  // Load availability for the selected tutor.
  useEffect(() => {
    if (tutor) {
      setAvailableSlots(AVAILABILITY[tutor] || []);
      setSelectedSlot("");
      setCustomMode(false);
    }
  }, [tutor]);

  // Navigation functions.
  const handleNext = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Form submit handler.
  const handleSubmit = async (e) => {
    e.preventDefault();
    let startTime, duration;
    if (!customMode) {
      startTime = new Date(selectedSlot);
      duration = 60;
    } else {
      startTime = new Date(customDateTime);
      duration = parseInt(customDuration, 10) || 60;
    }
    const endTime = new Date(startTime.getTime() + duration * 60000);
    const appointmentData = {
      subject,
      tutor,
      start: startTime,
      end: endTime,
      extendedProps: {
        appointmentMode,
        additionalNotes,
        feedbackSubmitted: false,
        feedback: "",
        joinUrl: "",
      }
    };
    onSave(appointmentData);
    setSubmitted(true);

    try {
      const response = await fetch("http://localhost:4000/api/appointments/create", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,  // Sending the token in the Authorization header
          "Content-Type": "application/json",  // Ensuring the server knows it's JSON data
        },
        body: JSON.stringify(appointmentData),  // Sending the actual appointment data
      });

      if(!response.ok){
        throw new Error("Unable to make appointment")
      }

      const res = await response.json()
      setSubmitted(true);
      console.log(res)
    }catch(err) {
      console.error(err);
    }
  };

  const progressPercentage = (currentStep / 2) * 100;

  // Switch-based rendering of form steps.
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="appointment-form-step">
            <h2>Basic Appointment Info</h2>
            <div className="appointment-form-group">
              <label htmlFor="subject">Subject/Course *</label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              >
                <option value="">--Select subject--</option>
                {SUBJECTS.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="appointment-form-group">
              <label htmlFor="tutor">Tutor *</label>
              <select
                id="tutor"
                value={tutor}
                onChange={(e) => setTutor(e.target.value)}
                required
                disabled={!subject}
              >
                <option value="">--Select tutor--</option>
                {subject &&
                  TUTORS[subject] &&
                  TUTORS[subject].map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
              </select>
            </div>
            {tutor && !customMode && (
              <div className="appointment-form-group">
                <p>
                  <strong>Available Time Slots:</strong>
                </p>
                {availableSlots.length === 0 ? (
                  <p>No slots available. You may request a custom time.</p>
                ) : (
                  <div className="time-slot-container">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <div
                          key={slot}
                          className={`time-slot-card ${isSelected ? "selected" : ""}`}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          <span className="time-slot-time">
                            {new Date(slot).toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
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
            {tutor && customMode && (
              <div className="appointment-form-group">
                <p>
                  <strong>Custom Time Request:</strong>
                </p>
                <label htmlFor="customDateTime">Preferred Date &amp; Time *</label>
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
                disabled={
                  !tutor ||
                  (!customMode && !selectedSlot) ||
                  (customMode && (!customDateTime || !customDuration))
                }
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

  // If the form has been submitted, display the success view with the checkmark.
  if (submitted) {
    return (
      <div className="feedback-page">
        <div className="success-card">
          <div className="checkmark-container">
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
              <path
                className="checkmark__check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
          </div>
          <h2>Appointment Created!</h2>
        </div>
      </div>
    );
  }

  // Main rendering: Render the appointment modal with progress bar and current step.
  return (
    <div className="appointment-page">
      <div className="appointment-card">
        <button className="appointment-close-btn" onClick={onClose}>
          ×
        </button>
        <div className="appointment-progress-bar">
          <div className="appointment-progress" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <form onSubmit={handleSubmit}>{renderStep()}</form>
      </div>
    </div>
  );
}

