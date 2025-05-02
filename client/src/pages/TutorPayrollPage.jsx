import React, { useState } from 'react';
import './TutorPayrollPage.css';

const TutorPayrollPage = () => {
  const [entries, setEntries] = useState([]);
  const [sessionDate, setSessionDate] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [payRate, setPayRate] = useState('');
  const [total, setTotal] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const earnings = parseFloat(hoursWorked) * parseFloat(payRate);
    const newEntry = { sessionDate, hoursWorked, payRate, earnings };
    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    setTotal(updatedEntries.reduce((sum, entry) => sum + entry.earnings, 0));
    setSessionDate('');
    setHoursWorked('');
    setPayRate('');
  };

  return (
    <div className="payroll-page">
      <div className="payroll-box">
        <h2 className="title">Tutor Payroll Dashboard</h2>

        <form onSubmit={handleSubmit} className="payroll-form">
          <label>
            Date of Session
            <input type="date" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} required />
          </label>
          <label>
            Hours Worked
            <input type="number" value={hoursWorked} onChange={(e) => setHoursWorked(e.target.value)} step="0.1" required />
          </label>
          <label>
            Hourly Rate ($)
            <input type="number" value={payRate} onChange={(e) => setPayRate(e.target.value)} step="0.01" required />
          </label>
          <button type="submit">Log Hours</button>
        </form>

        <div className="summary-section">
          <h3>Payroll Summary</h3>
          <ul>
            {entries.map((entry, idx) => (
              <li key={idx}>
                📅 {entry.sessionDate} – ⏱ {entry.hoursWorked} hrs @ ${entry.payRate}/hr = <strong>${entry.earnings.toFixed(2)}</strong>
              </li>
            ))}
          </ul>
          <h4 className="total">💰 Total: ${total.toFixed(2)}</h4>
        </div>
      </div>
    </div>
  );
};

export default TutorPayrollPage;