import React, { useState, useEffect, useMemo } from 'react';
import './AdminPayOverview.css'; 

// --- Mock Data Source (Simulates fetching from a backend) ---
const getMockTutorData = () => {
    // Data structure: Array of tutors, each with an array of their session entries.
    return [
        { // Tutor 1 Data
            id: 'tutor101',
            name: 'Ethan',
            entries: [
                {   id: 1, date: '2025-04-01', student: 'Alex', subject: 'Math', confirmationCode: 'ALXM1', startTime: '16:00', endTime: '18:00', regularHours: '2', overtimeHours: '0', regularRate: 45, overtimeRate: 67.5, notes: 'Covered linear equations.' },
                {   id: 2, date: '2025-04-03', student: 'Maria', subject: 'Test Prep', confirmationCode: 'MARTP1', startTime: '17:00', endTime: '19:30', regularHours: '2.5', overtimeHours: '0', regularRate: 55, overtimeRate: 82.5, notes: 'SAT practice test review.' },
                {   id: 3, date: '2025-04-08', student: 'Alex', subject: 'Math', confirmationCode: 'ALXM2', startTime: '16:30', endTime: '18:00', regularHours: '1.5', overtimeHours: '0', regularRate: 45, overtimeRate: 67.5, notes: 'Quadratic functions.' },
            ],
        },
        { // Tutor 2 Data
            id: 'tutor102',
            name: 'Videl',
            entries: [
                {   id: 4, date: '2025-04-02', student: 'Sam', subject: 'Science', confirmationCode: 'SAMS1', startTime: '15:00', endTime: '17:00', regularHours: '2', overtimeHours: '0', regularRate: 50, overtimeRate: 75, notes: 'Biology basics.' },
                {   id: 5, date: '2025-04-04', student: 'Chloe', subject: 'History', confirmationCode: 'CHLH1', startTime: '18:00', endTime: '19:00', regularHours: '1', overtimeHours: '0', regularRate: 40, overtimeRate: 60, notes: 'American Revolution.' },
                {   id: 6, date: '2025-04-09', student: 'Sam', subject: 'Science', confirmationCode: 'SAMS2', startTime: '15:30', endTime: '18:00', regularHours: '2.5', overtimeHours: '0', regularRate: 50, overtimeRate: 75, notes: 'Chemistry homework help.' },
                {   id: 7, date: '2025-04-10', student: 'Multiple (Group)', subject: 'Study Skills', confirmationCode: 'GRPSK1', startTime: '13:00', endTime: '17:30', regularHours: '4', overtimeHours: '0.5', regularRate: 40, overtimeRate: 60, notes: 'Long session covering organization.' },
            ],
        },
         {  // Tutor 3 Data (No entries this period simulation)
            id: 'tutor103',
            name: 'Sarah',
            entries: [] // Sarah had no hours this period
        }
    ];
};

const AdminPayOverview = () => {
    // Simulate fetching data on component mount
    const [tutorData, setTutorData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        try {
            // Simulate API call delay
            setTimeout(() => {
                setTutorData(getMockTutorData());
                setIsLoading(false);
            }, 500);
        } catch (err) {
            console.error("Failed to fetch tutor data:", err);
            setError("Could not load tutor data. Please try again later.");
            setIsLoading(false);
        }
    }, []);


    // --- Data Aggregation (Calculates both overall and per-tutor totals) ---
    const payPeriodSummary = useMemo(() => {
        let grandTotalPay = 0;
        let grandTotalHours = 0;
        let grandTotalOvertime = 0;
        const tutorBreakdown = []; // Array to hold individual tutor summaries

        if (!tutorData || tutorData.length === 0) {
            return {
                grandTotalPay: '0.00',
                grandTotalHours: '0.00',
                grandTotalOvertime: '0.00',
                tutorBreakdown: [], // Return empty breakdown
             };
        }

        tutorData.forEach(tutor => {
            let tutorTotalPay = 0;
            let tutorTotalHours = 0;
            let tutorTotalOvertime = 0;

            if (tutor.entries && Array.isArray(tutor.entries)) {
                tutor.entries.forEach(entry => {
                    const regHours = parseFloat(entry.regularHours) || 0;
                    const otHours = parseFloat(entry.overtimeHours) || 0;
                    const regRate = parseFloat(entry.regularRate) || 0;
                    const otRate = parseFloat(entry.overtimeRate) || 0;

                    // Calculate amounts for this entry
                    const entryPay = (regHours * regRate) + (otHours * otRate);
                    const entryHours = regHours + otHours;

                    // Add to tutor totals
                    tutorTotalPay += entryPay;
                    tutorTotalHours += entryHours;
                    tutorTotalOvertime += otHours;

                    // Add to grand totals
                    grandTotalPay += entryPay;
                    grandTotalHours += entryHours;
                    grandTotalOvertime += otHours;
                });
            }

            // Add this tutor's summary to the breakdown array
            // Only include tutors who worked hours
            if (tutorTotalHours > 0) {
                tutorBreakdown.push({
                    id: tutor.id,
                    name: tutor.name,
                    totalHours: tutorTotalHours.toFixed(2),
                    totalOvertimeHours: tutorTotalOvertime.toFixed(2),
                    estimatedPay: tutorTotalPay.toFixed(2),
                });
            }
        });

        return {
            grandTotalPay: grandTotalPay.toFixed(2),
            grandTotalHours: grandTotalHours.toFixed(2),
            grandTotalOvertime: grandTotalOvertime.toFixed(2),
            tutorBreakdown, // Include the array of tutor summaries
        };
    }, [tutorData]);

    // --- Rendering Logic ---

    if (isLoading) {
        return <div className="loading-message">Loading Administrator Overview...</div>;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    return (
        <div className="admin-pay-overview-container">
            <h1 className="overview-title">Administrator Pay Overview</h1>

            {/* Overall Summary Box */}
            <div className="summary-box">
                <h2 className="summary-heading">Current Pay Period Totals</h2>
                <div className="summary-details">
                    <div className="summary-item">
                        <span className="summary-label">Total Estimated Cost:</span>
                        <span className="summary-value cost">${payPeriodSummary.grandTotalPay}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Total Hours Logged:</span>
                        <span className="summary-value">{payPeriodSummary.grandTotalHours}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Total Overtime Hours:</span>
                        <span className="summary-value overtime">{payPeriodSummary.grandTotalOvertime}</span>
                    </div>
                </div>
                <p className="pay-period-dates">
                    (Pay Period Example: April 1, 2025 - April 15, 2025)
                </p>
            </div>

            {/* Individual Tutor Breakdown Section */}
            <div className="tutor-breakdown-section">
                <h2 className="breakdown-heading">Tutor Breakdown</h2>
                {payPeriodSummary.tutorBreakdown.length > 0 ? (
                    payPeriodSummary.tutorBreakdown.map(tutor => (
                        <div key={tutor.id} className="tutor-summary-item">
                            <h3 className="tutor-name">{tutor.name}</h3>
                            <div className="tutor-details">
                                <p>
                                    <span className="tutor-label">Est. Pay:</span>
                                    <span className="tutor-value pay">${tutor.estimatedPay}</span>
                                </p>
                                <p>
                                    <span className="tutor-label">Total Hrs:</span>
                                    <span className="tutor-value">{tutor.totalHours}</span>
                                </p>
                                <p>
                                    <span className="tutor-label">OT Hrs:</span>
                                    <span className="tutor-value">{tutor.totalOvertimeHours}</span>
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-tutor-data">No tutors logged hours for this pay period.</p>
                )}
            </div>
        </div>
    );
};

export default AdminPayOverview;