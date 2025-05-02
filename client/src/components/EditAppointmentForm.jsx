import React, { useState, useEffect } from 'react';
import './EditAppointmentForm.css';

// Function to format dates into a readable format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString([], { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: '2-digit' 
  });
};

const EditAppointmentForm = ({ initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    start: '',
    end: '',
    subject: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);  // Stores the available time slots
  const [selectedSlot, setSelectedSlot] = useState(initialData.start || "");  // Set initial start time if available
  const [selectedEndTime, setSelectedEndTime] = useState(initialData.end || "");
  const [tutors, setTutorInfo] = useState([]); // To store the tutors data
  const tutorId = initialData.tutor;  // Tutor ID from the initial data

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        start: initialData.start,
        end: initialData.end,
        subject: initialData.subject || ''
      });
    }
  }, [initialData]);

  // Fetch the tutor's availability based on the tutor's ID
  useEffect(() => {
    const fetchTutorInfo = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/tutors/${tutorId}/info`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        console.log("Fetched Tutor Info ZEKEY :", data);
        setTutorInfo(data);  // Store the fetched data
        setAvailableSlots(data.availableSlots); // Set the available slots for the tutor
      } catch (err) {
        console.error("Error fetching tutor info:", err);
      }
    };
  
    if (tutorId) {
      fetchTutorInfo();
    }
  }, [tutorId]);  // This will run whenever the tutorId changes
  
  // Handle slot selection (set start and end time)
  const handleSlotSelection = (slotStart) => {
    setSelectedSlot(slotStart);
    const newEndTime = getEndTimeForSlot(slotStart);  // Get the corresponding end time
    setFormData({
      ...formData,
      start: slotStart,
      end: newEndTime,
    });
    setSelectedEndTime(newEndTime);
  };

  // Get the corresponding end time for the selected start time
  const getEndTimeForSlot = (slotStart) => {
    const selectedStart = new Date(slotStart);
    const matchingSlot = availableSlots
      .flatMap(slot => slot.hours) // Flatten hours for each tutor's slot
      .find(hour => new Date(hour.start).toISOString() === selectedStart.toISOString());

    return matchingSlot ? matchingSlot.end : ''; // Return end time for selected start time
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);  // Pass the updated form data back to parent
    }
    onClose();  // Close the modal
  };

  return (
    <div className="edit-appointment-modal">
      <div className="modal-content">
        <h3>Edit Appointment</h3>
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option value="">Select Subject</option>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
            </select>
          </div>

          {/* Start Time Selection as Cards */}
          <div className="form-group">
            <label htmlFor="start">Start Time</label>
            <div className="time-slot-container">
              {availableSlots && availableSlots.map((slot, index) => (
                <div key={index} className="time-slot-cards">
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
              ))}
            </div>
          </div>


          <div className="modal-actions">
            <button type="submit" className="save-btn">Save Changes</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAppointmentForm;
