// AppointmentForm.jsx
import React, { useState } from 'react';
import './AppointmentForm.css';

const AppointmentForm = ({ onAppointmentSubmit }) => {
    const [tutor, setTutor] = useState('Mr. Johnson');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState('10:00');
    const [subject, setSubject] = useState('Math');
    const [monthOffset, setMonthOffset] = useState(0);
    const [duration, setDuration] = useState('30 mins');

    const tutors = ['Mr. Johnson', 'Mr. Smith', 'Ms. Johnson', 'Dr. Lee', 'Prof. Williams'];
    const durationOptions = ['30 mins', '1 hour', '1 hour 30 mins', '2 hours', '2 hours 30 mins', '3 hours', '3 hours 30 mins', '4 hours'];

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const getMonthName = (month) => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        return monthNames[month];
    };

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + monthOffset;
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

    const handleDateClick = (day) => {
        setDate(new Date(currentYear, currentMonth, day));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const appointment = { tutor, date: date.toISOString().split('T')[0], time, subject, duration };
        onAppointmentSubmit(appointment);
        setTutor('Mr. Johnson');
        setDate(new Date());
        setTime('10:00');
        setSubject('Math');
        setDuration('30 mins');
    };

    return (
        <div className="appointment-form-container">
            <div className="main-content-area">
                <div className="calendar-section">
                    <div className="month-navigation">
                        <button onClick={() => setMonthOffset(monthOffset - 1)}>←</button>
                        <span>{getMonthName(currentMonth)} {currentYear}</span>
                        <button onClick={() => setMonthOffset(monthOffset + 1)}>→</button>
                    </div>
                    <div className="calendar">
                        <div className="weekdays">
                            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                        </div>
                        <div className="days">
                            {Array.from({ length: firstDayOfMonth }).map((_, index) => <div key={`empty-${index}`} className="empty-day"></div>)}
                            {Array.from({ length: daysInMonth }).map((day, index) => (
                                <div
                                    key={`day-${index}`}
                                    className={`day ${date.getDate() === index + 1 && date.getMonth() === currentMonth && date.getFullYear() === currentYear ? 'selected' : ''}`}
                                    onClick={() => handleDateClick(index + 1)}
                                >
                                    {index + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="tutor-info-and-form">
                    <div className="tutor-info">
                        <div className="profile-placeholder"></div>
                        <p><strong>{tutor}</strong></p>
                        <div className="duration-select">
                            <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                                {durationOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <p>Phone call</p>
                        <p>This is an example of a meeting you would have with a potential customer to demonstrate your product.</p>
                        <div className="tutor-buttons">
                            <button className="message-button">Message</button>
                            <button className="promotional-button">Promotional</button>
                            <button className="balance-button">Balance</button>
                        </div>
                    </div>
                    <div className="date-time-selection">
                        <h3>Select a Time & Subject</h3>
                        <div className="time-input">
                            <label htmlFor="time">Time:</label>
                            <input
                                type="time"
                                id="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="subject">Subject:</label>
                            <input
                                type="text"
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                            />
                        </div>
                        <div className="appointment-buttons">
                            <button className="cancel-button">Cancel</button>
                            <button type="submit" className="create-button" onClick={handleSubmit}>Create</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentForm;