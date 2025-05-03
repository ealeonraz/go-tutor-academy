import React, { useState, useEffect } from 'react';
import './EditSchedule.css';

const EditScheduleForm = ({ tutorId, initialData, onClose }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    start: initialData.start || '',
    end: initialData.end || '',
  });
  const [availableHours, setAvailableHours] = useState([]); // State for available hours
  const [tutorInfo, setTutorInfo] = useState({}); // State for tutor's information (e.g., name, subjects)

  // Fetch the tutor's available hours and other info from the backend when the form is mounted
  useEffect(() => {
    const fetchTutorAvailability = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/tutors/${tutorId}/info`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tutor availability');
        }

        const data = await response.json();
        console.log("TUTOR DATA", data);

        // Set tutor's available hours
        if (data && data.availableHours) {
          setAvailableHours(data.availableHours); 
        }

        // Set other tutor info (e.g., name, email, subjects)
        if (data) {
          setTutorInfo({
            name: `${data.firstName} ${data.lastName}`,
            id: data._id,
            email: data.email,
            subjects: data.subjects,
            availableHours: data.availableHours,
          });
        } else {
          console.error('No data found for the tutor');
        }
      } catch (error) {
        console.error('Error fetching tutor availability:', error);
      }
    };

    if (tutorId) {
      fetchTutorAvailability();
    }
  }, [tutorId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle Save Logic for Updating Appointment
  const handleSaveAppointment = async () => {
    const updatedAppointment = {
      id: initialData.id,
      title: formData.title,
      start: formData.start,
      end: formData.end,
    };

    // Send the updated appointment data to the backend
    try {
      const response = await fetch(`http://localhost:4000/api/tutors/:id/availableHours`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tutorInfo), // Send the updated tutor info and available hours
      });

      if (response.ok) {
        alert('Schedule updated successfully!');
        onClose(); // Close the modal after saving
      } else {
        alert('Failed to update schedule');
      }
    } catch (err) {
      console.error('Error updating schedule:', err);
      alert('Error updating schedule');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSaveAppointment(); // Call the save function
  };

  return (
    <div className="edit-schedule-modal">
      <div className="modal-content">
        <h2>Edit Schedule</h2>

        {/* Display tutor info if available */}
        {tutorInfo.name && (
          <div className="tutor-info">
            <p><strong>Tutor:</strong> {tutorInfo.name}</p>
            <p><strong>Email:</strong> {tutorInfo.email}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Start Time</label>
            <input
              type="datetime-local"
              name="start"
              value={formData.start}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label>End Time</label>
            <input
              type="datetime-local"
              name="end"
              value={formData.end}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label>Available Hours</label>
            <select
              value={formData.start} // Default value set to the selected start time
              onChange={(e) => handleInputChange(e)} // You can implement logic here to update start and end times based on selection
            >
              {availableHours.length > 0 ? (
                availableHours.map((slot, index) => (
                  <optgroup key={index} label={slot.day}>
                    {slot.hours.map((hour, i) => (
                      <option key={i} value={hour.start}>
                        {new Date(hour.start).toLocaleTimeString()} - {new Date(hour.end).toLocaleTimeString()}
                      </option>
                    ))}
                  </optgroup>
                ))
              ) : (
                <option value="">No available hours</option>
              )}
            </select>
          </div>

          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditScheduleForm;
