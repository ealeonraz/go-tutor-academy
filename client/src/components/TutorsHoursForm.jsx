import React, { useState } from 'react';
// DT 79 Data Validation For Tutor Hours 
const ValidateTutorInput = ({ onSubmit }) => {
  const [date, setDate] = useState('');
  const [hours, setHours] = useState('');
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [error, setError] = useState('');

  // Validation function for date and hours
  const validateInput = () => {
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/; // MM/DD/YYYY format
    const hoursLimit = 8;
    let errorMessage = '';

    // Validate date format
    if (!dateRegex.test(date)) {
      errorMessage = 'Invalid date format. Please use MM/DD/YYYY.';
    }

    // Validate hours (must be numerical and less than or equal to 8)
    else if (isNaN(hours) || hours <= 0 || hours > hoursLimit) {
      errorMessage = `Invalid hours. Hours should be between 1 and ${hoursLimit}.`;
    }

    // Validate confirmation number (must not be empty)
    else if (confirmationNumber.trim() === '') {
      errorMessage = 'Confirmation number is required.';
    }

    setError(errorMessage);
    return errorMessage === ''; // Returns true if no error
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateInput()) {
      // Pass data to the parent (this can be your form submission handler)
      onSubmit({ date, hours, confirmationNumber });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date (MM/DD/YYYY):</label>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="MM/DD/YYYY"
          />
        </div>
        <div>
          <label>Hours Worked:</label>
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="Enter hours"
          />
        </div>
        <div>
          <label>Confirmation Number:</label>
          <input
            type="text"
            value={confirmationNumber}
            onChange={(e) => setConfirmationNumber(e.target.value)}
            placeholder="Confirmation number"
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ValidateTutorInput;