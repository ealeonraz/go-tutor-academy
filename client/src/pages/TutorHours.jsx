import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './TutorHours.css';

// --- Constants and Helpers ---
const SUBJECT_RATES = {
    'Math': 45,
    'Science': 50,
    'History': 40,
    'English': 42,
    'Test Prep': 55,
};
const DEFAULT_REGULAR_RATE = 40;
const DEFAULT_OVERTIME_RATE_MULTIPLIER = 1.5; // 1.5x the regular rate for OT

// Helper to calculate duration in hours between two HH:MM time strings
const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    try {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);

        if (isNaN(start) || isNaN(end)) return 0; // Invalid time format

        let diff = end - start; // Difference in milliseconds

        // Handle overnight case (assume session < 24 hours)
        if (diff < 0) {
            diff += 24 * 60 * 60 * 1000; // Add 24 hours in milliseconds
        }

        return diff / (1000 * 60 * 60); // Convert ms to hours
    } catch (e) {
        console.error("Error calculating duration:", e);
        return 0;
    }
};

// Helper to get default OT rate based on regular rate
const getDefaultOvertimeRate = (regularRate) => {
    const rate = parseFloat(regularRate) || DEFAULT_REGULAR_RATE;
    return rate * DEFAULT_OVERTIME_RATE_MULTIPLIER;
};

// --- Component ---
const TutorHours = () => {
    const [entries, setEntries] = useState([
        // Example initial entry - add more or start empty
        {
            id: Date.now(),
            date: new Date().toISOString().slice(0, 10),
            student: 'Ethan',
            subject: 'Math',
            confirmationCode: 'ETHM123',
            startTime: '16:00',
            endTime: '17:30',
            regularHours: '1.5', // Tutor manually enters hours for now
            overtimeHours: '0',  // Tutor manually enters hours for now
            regularRate: SUBJECT_RATES['Math'] || DEFAULT_REGULAR_RATE,
            overtimeRate: getDefaultOvertimeRate(SUBJECT_RATES['Math'] || DEFAULT_REGULAR_RATE),
            notes: 'Worked on Algebra chapter 5.',
            errors: {}
        }
    ]);
    const [validationErrors, setValidationErrors] = useState([]); // Overall validation summary

    // Example static data (can be fetched or managed elsewhere)
    const [previousHours] = useState(52); // Example only
    const [payPeriodStart] = useState('2024-04-01'); // Example only
    const [payPeriodEnd] = useState('2024-04-15'); // Example only


    // --- Validation Logic ---
    const validateHourEntry = (value, fieldName = "Hours") => {
        if (value === '' || value === null || value === undefined) return `${fieldName} required.`; // Now required
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return `${fieldName} must be a number.`;
        if (numValue < 0) return `${fieldName} cannot be negative.`;
        // Maybe add max check if needed: if (numValue > 24) return `${fieldName} seems too high.`;
        return null; // No error
    };

    const validateRate = (value, fieldName = "Rate") => {
        if (value === '' || value === null || value === undefined) return `${fieldName} required.`;
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return `${fieldName} must be a number.`;
        if (numValue < 0) return `${fieldName} cannot be negative.`;
        return null; // No error
    };

    const validateEntry = (entry) => {
        const errors = {};
        if (!entry.date) errors.date = "Date required.";
        if (!entry.student?.trim()) errors.student = "Student name required.";
        if (!entry.subject) errors.subject = "Subject selection required.";
        // Optional validation: if (!entry.confirmationCode?.trim()) errors.confirmationCode = "Conf. code required.";
        if (!entry.startTime) errors.startTime = "Start time required.";
        if (!entry.endTime) errors.endTime = "End time required.";

        // Time validation
        const duration = calculateDuration(entry.startTime, entry.endTime);
        if (entry.startTime && entry.endTime) {
            if (duration <= 0) errors.endTime = "End time must be after start time.";
        }

        // Hours validation
        const regHoursError = validateHourEntry(entry.regularHours, "Reg. Hours");
        if (regHoursError) errors.regularHours = regHoursError;
        const otHoursError = validateHourEntry(entry.overtimeHours, "OT Hours");
        if (otHoursError) errors.overtimeHours = otHoursError;

        // Basic check: ensure entered hours aren't wildly different from calculated duration
        // Note: This is a soft check; manual hours might differ for valid reasons (breaks not billed etc.)
        const enteredTotalHours = (parseFloat(entry.regularHours) || 0) + (parseFloat(entry.overtimeHours) || 0);
        if (duration > 0 && Math.abs(enteredTotalHours - duration) > 0.1) { // Allow small rounding diff
            // Soft warning, not a blocking error? Decide based on requirements.
            // errors.regularHours = errors.regularHours || `Total entered hours (${enteredTotalHours.toFixed(2)}) don't match duration (${duration.toFixed(2)}). Adjust if needed.`;
        }


        // Rate validation
        const regRateError = validateRate(entry.regularRate, "Reg. Rate");
        if (regRateError) errors.regularRate = regRateError;
        const otRateError = validateRate(entry.overtimeRate, "OT Rate");
        if (otRateError) errors.overtimeRate = otRateError;

        // Notes validation (e.g., minimum length?)
        // if (!entry.notes || entry.notes.length < 10) errors.notes = "Min 10 chars for notes.";

        return errors;
    };


    // --- Event Handlers ---
    const handleEntryChange = (id, key, value) => {
        setEntries(prevEntries =>
            prevEntries.map(entry => {
                if (entry.id === id) {
                    const updatedEntry = { ...entry, [key]: value };

                    // Auto-update rates if subject changes and rate hasn't been manually set yet
                    // Or if the rate is empty/invalid
                    if (key === 'subject') {
                         const defaultRate = SUBJECT_RATES[value] || DEFAULT_REGULAR_RATE;
                         // Only update if rate is default, empty or invalid
                         const currentRate = parseFloat(updatedEntry.regularRate);
                         const isDefaultOrInvalid = isNaN(currentRate) || currentRate <= 0 || currentRate === (SUBJECT_RATES[entry.subject] || DEFAULT_REGULAR_RATE);

                         if(isDefaultOrInvalid) {
                              updatedEntry.regularRate = defaultRate;
                              updatedEntry.overtimeRate = getDefaultOvertimeRate(defaultRate);
                         }
                    }

                    // Auto-update OT rate if Reg rate changes and OT rate is default/invalid
                    if (key === 'regularRate') {
                        const currentOtRate = parseFloat(updatedEntry.overtimeRate);
                        const prevOtRate = getDefaultOvertimeRate(entry.regularRate); // OT rate based on *previous* regular rate
                        const isOtDefaultOrInvalid = isNaN(currentOtRate) || currentOtRate <= 0 || currentOtRate === prevOtRate;

                        if (isOtDefaultOrInvalid) {
                             updatedEntry.overtimeRate = getDefaultOvertimeRate(value);
                        }
                    }


                    // Re-validate the whole entry after a change
                    const entryErrors = validateEntry(updatedEntry);
                    return { ...updatedEntry, errors: entryErrors };
                }
                return entry;
            })
        );
         // Note: Totals calculation relies on useMemo watching 'entries'
    };

     const addRow = () => {
         const newId = Date.now();
         setEntries(prevEntries => [
             ...prevEntries,
             {
                 id: newId,
                 date: new Date().toISOString().slice(0, 10),
                 student: '',
                 subject: '',
                 confirmationCode: '',
                 startTime: '',
                 endTime: '',
                 regularHours: '0', // Default to 0
                 overtimeHours: '0', // Default to 0
                 regularRate: DEFAULT_REGULAR_RATE, // Start with base default
                 overtimeRate: getDefaultOvertimeRate(DEFAULT_REGULAR_RATE), // Start with base default OT
                 notes: '',
                 errors: {} // Initialize with empty errors
             }
         ]);
     };

     const removeRow = (id) => {
         setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
         // Clear overall errors if the deleted row was the only cause
         // (Simplified: just recalculate errors on next submit/save)
         setValidationErrors([]);
     };


    // --- Calculation Logic (using useMemo for performance) ---
    const calculatedTotals = useMemo(() => {
        let totalRegularHours = 0;
        let totalOvertimeHours = 0;
        let totalPay = 0;

        entries.forEach(entry => {
            const regHours = parseFloat(entry.regularHours) || 0;
            const otHours = parseFloat(entry.overtimeHours) || 0;
            const regRate = parseFloat(entry.regularRate) || 0;
            const otRate = parseFloat(entry.overtimeRate) || 0;

            // Only add valid numbers to totals
            if (regHours > 0 && regRate > 0) {
                totalRegularHours += regHours;
                totalPay += regHours * regRate;
            }
            if (otHours > 0 && otRate > 0) {
                totalOvertimeHours += otHours;
                totalPay += otHours * otRate;
            }
        });

        return {
            totalRegularHours,
            totalOvertimeHours,
            totalCombinedHours: totalRegularHours + totalOvertimeHours,
            totalPay
        };
    }, [entries]); // Recalculate only when entries change


    // --- Actions (Save, Submit) ---
    const runFullValidation = useCallback(() => {
        let allEntriesValid = true;
        const overallErrors = [];
        setEntries(prevEntries =>
            prevEntries.map((entry, index) => {
                const entryErrors = validateEntry(entry);
                if (Object.keys(entryErrors).length > 0) {
                    allEntriesValid = false;
                    // Add specific errors to the overall list for summary display
                    Object.entries(entryErrors).forEach(([field, message]) => {
                        overallErrors.push(`Row ${index + 1} (${entry.date || 'No Date'}): ${field} - ${message}`);
                    });
                    return { ...entry, errors: entryErrors }; // Update entry state with errors
                }
                return { ...entry, errors: {} }; // Clear errors if valid
            })
        );
        setValidationErrors(overallErrors); // Update summary errors
        return allEntriesValid;
    }, []); // No dependencies needed if it reads state via setEntries callback

    const saveTimesheet = () => {
        const isValid = runFullValidation();
        if (!isValid) {
            alert('Please fix the errors before saving.');
            console.log("Validation Errors:", validationErrors);
            // Scroll to the first error? (More advanced UX)
            return;
        }
        console.log("Saving timesheet data:", entries);
        // TODO: Send 'entries' data to an actual backend API
        alert('Timesheet Draft Saved! (Data logged to console)');
        setValidationErrors([]); // Clear errors on successful save
    };

     const submitTimesheet = () => {
        const isValid = runFullValidation();
        if (!isValid) {
             alert('Please fix the errors indicated before submitting.');
             console.log("Validation Errors:", validationErrors);
             return;
        }
        console.log("Submitting timesheet data:", entries);
        // TODO: Send 'entries' data to backend API for processing/approval
        alert('Timesheet Submitted! (Data logged to console)');
        setValidationErrors([]); // Clear errors on successful submit
    };


    // --- Get current subject options ---
    const subjectOptions = Object.keys(SUBJECT_RATES);


    // --- JSX Rendering ---
    return (
        <div className="timesheet-container">
            <header className="header">
                <div className="logo">GoTutor Session Log</div>
                <div className="profile-icon" title="User Profile (Placeholder)">👤</div>
            </header>

            <main className="main-content">
                <div className="timesheet-header">
                    <h2>My Session Log</h2>
                    {/* Removed date selector - date is per row now */}
                    <button className="report-button">Timesheet Summary Report</button>
                </div>

                {/* Validation Summary Area */}
                {validationErrors.length > 0 && (
                     <div className="validation-summary">
                         <strong>Please review the following issues:</strong>
                         <ul>
                             {validationErrors.map((error, index) => (
                                 <li key={index}>{error}</li>
                             ))}
                         </ul>
                     </div>
                 )}

                {/* Session Entry Grid */}
                <div className="timesheet-grid">
                    <div className="grid-header">
                        <div>Date</div>
                        <div>Student</div>
                        <div>Subject</div>
                        <div>Conf Code</div>
                        <div>Start Time</div>
                        <div>End Time</div>
                        <div>Duration</div>
                        <div>Reg Hrs</div>
                        <div>OT Hrs</div>
                        <div>Reg Rate</div>
                        <div>OT Rate</div>
                        <div>Notes</div>
                        <div>Est. Pay</div>
                        <div>Action</div>
                    </div>
                    {entries.map((entry, index) => {
                        // Calculate display values for this row
                         const duration = calculateDuration(entry.startTime, entry.endTime);
                         const estimatedRowPay = ( (parseFloat(entry.regularHours) || 0) * (parseFloat(entry.regularRate) || 0) )
                                              + ( (parseFloat(entry.overtimeHours) || 0) * (parseFloat(entry.overtimeRate) || 0) );

                        return (
                        <div className="grid-row" key={entry.id}>
                            {/* Date */}
                            <div className="input-wrapper">
                                <input type="date" value={entry.date} onChange={e => handleEntryChange(entry.id, 'date', e.target.value)} aria-label={`Date for row ${index + 1}`} style={entry.errors?.date ? { borderColor: 'red' } : {}}/>
                                {entry.errors?.date && <span className="error-message">{entry.errors.date}</span>}
                            </div>
                            {/* Student */}
                            <div className="input-wrapper">
                                <input type="text" placeholder="Student Name" value={entry.student} onChange={e => handleEntryChange(entry.id, 'student', e.target.value)} aria-label={`Student for row ${index + 1}`} style={entry.errors?.student ? { borderColor: 'red' } : {}}/>
                                {entry.errors?.student && <span className="error-message">{entry.errors.student}</span>}
                            </div>
                             {/* Subject */}
                             <div className="input-wrapper">
                                <select value={entry.subject} onChange={e => handleEntryChange(entry.id, 'subject', e.target.value)} aria-label={`Subject for row ${index + 1}`} style={entry.errors?.subject ? { borderColor: 'red' } : {}}>
                                    <option value="" disabled>Select Subject</option>
                                    {subjectOptions.map(sub => (<option key={sub} value={sub}>{sub}</option>))}
                                    {/* Add Other if needed */}
                                </select>
                                {entry.errors?.subject && <span className="error-message">{entry.errors.subject}</span>}
                            </div>
                            {/* Confirmation Code */}
                            <div className="input-wrapper">
                                <input type="text" placeholder="Code (Optional)" value={entry.confirmationCode} onChange={e => handleEntryChange(entry.id, 'confirmationCode', e.target.value)} aria-label={`Confirmation code for row ${index + 1}`} style={entry.errors?.confirmationCode ? { borderColor: 'red' } : {}}/>
                                {entry.errors?.confirmationCode && <span className="error-message">{entry.errors.confirmationCode}</span>}
                            </div>
                             {/* Start Time */}
                             <div className="input-wrapper">
                                <input type="time" value={entry.startTime} onChange={e => handleEntryChange(entry.id, 'startTime', e.target.value)} aria-label={`Start time for row ${index + 1}`} style={entry.errors?.startTime ? { borderColor: 'red' } : {}}/>
                                {entry.errors?.startTime && <span className="error-message">{entry.errors.startTime}</span>}
                            </div>
                             {/* End Time */}
                             <div className="input-wrapper">
                                <input type="time" value={entry.endTime} onChange={e => handleEntryChange(entry.id, 'endTime', e.target.value)} aria-label={`End time for row ${index + 1}`} style={entry.errors?.endTime || entry.errors?.startTime /* Show error here too if end<start */ ? { borderColor: 'red' } : {}}/>
                                {entry.errors?.endTime && <span className="error-message">{entry.errors.endTime}</span>}
                             </div>
                              {/* Duration (Display Only) */}
                            <div className="display-field" title="Calculated Duration (Hours)">
                                {duration > 0 ? duration.toFixed(2) : 'N/A'}
                             </div>
                             {/* Regular Hours (Manual Input) */}
                             <div className="input-wrapper">
                                <input type="number" step="0.25" min="0" placeholder="0.0" value={entry.regularHours} onChange={e => handleEntryChange(entry.id, 'regularHours', e.target.value)} aria-label={`Regular hours for row ${index + 1}`} style={entry.errors?.regularHours ? { borderColor: 'red' } : {}}/>
                                {entry.errors?.regularHours && <span className="error-message">{entry.errors.regularHours}</span>}
                             </div>
                             {/* Overtime Hours (Manual Input) */}
                             <div className="input-wrapper">
                                <input type="number" step="0.25" min="0" placeholder="0.0" value={entry.overtimeHours} onChange={e => handleEntryChange(entry.id, 'overtimeHours', e.target.value)} aria-label={`Overtime hours for row ${index + 1}`} style={entry.errors?.overtimeHours ? { borderColor: 'red' } : {}}/>
                                {entry.errors?.overtimeHours && <span className="error-message">{entry.errors.overtimeHours}</span>}
                             </div>
                             {/* Regular Rate */}
                             <div className="input-wrapper">
                                <input type="number" step="0.01" min="0" placeholder="Rate" value={entry.regularRate} onChange={e => handleEntryChange(entry.id, 'regularRate', e.target.value)} aria-label={`Regular rate for row ${index + 1}`} style={entry.errors?.regularRate ? { borderColor: 'red' } : {}}/>
                                {entry.errors?.regularRate && <span className="error-message">{entry.errors.regularRate}</span>}
                             </div>
                             {/* Overtime Rate */}
                              <div className="input-wrapper">
                                <input type="number" step="0.01" min="0" placeholder="OT Rate" value={entry.overtimeRate} onChange={e => handleEntryChange(entry.id, 'overtimeRate', e.target.value)} aria-label={`Overtime rate for row ${index + 1}`} style={entry.errors?.overtimeRate ? { borderColor: 'red' } : {}}/>
                                {entry.errors?.overtimeRate && <span className="error-message">{entry.errors.overtimeRate}</span>}
                             </div>
                              {/* Notes */}
                             <div className="input-wrapper">
                                <textarea placeholder="Session notes..." value={entry.notes} onChange={e => handleEntryChange(entry.id, 'notes', e.target.value)} aria-label={`Notes for row ${index + 1}`} style={entry.errors?.notes ? { borderColor: 'red' } : {}}/>
                                {entry.errors?.notes && <span className="error-message">{entry.errors.notes}</span>}
                             </div>
                              {/* Estimated Pay (Display Only) */}
                             <div className="display-field" title="Estimated Pay for this Session">
                                ${estimatedRowPay > 0 ? estimatedRowPay.toFixed(2) : '0.00'}
                             </div>
                              {/* Actions */}
                             <div className="input-wrapper"> {/* Use wrapper for consistent alignment */}
                                 <button onClick={() => removeRow(entry.id)} className="action-button" title="Remove this session" aria-label={`Remove session row ${index + 1}`}>X</button>
                             </div>
                        </div>
                        );
                    })}
                </div>

                {/* Add Row Button & Submit Actions */}
                 <div className="grid-actions">
                    <button onClick={addRow} className="add-row-button">+ Add Session</button>
                     <div className="grid-submit-buttons">
                        <button onClick={saveTimesheet} className="save-button">Save Draft</button>
                        <button onClick={submitTimesheet} className="submit-button">Submit for Approval</button>
                    </div>
                </div>


                {/* Overall Summary Section */}
                <div className="timesheet-summary">
                     <div className="summary-title">Pay Period Summary</div>
                     <div className="summary-details">
                        {/* Display calculated totals */}
                        <p><span>Total Regular Hours:</span> <span>{calculatedTotals.totalRegularHours.toFixed(2)}</span></p>
                         <p><span>Total Overtime Hours:</span> <span>{calculatedTotals.totalOvertimeHours.toFixed(2)}</span></p>
                         <p><span>Total Combined Hours:</span> <span>{calculatedTotals.totalCombinedHours.toFixed(2)}</span></p>
                         <p><span style={{fontWeight: 'bold'}}>Total Estimated Pay:</span> <span style={{fontSize: '1.1em', color: '#28a745'}}>${calculatedTotals.totalPay.toFixed(2)}</span></p>
                         {/* Static example data */}
                         <p><span>Previous Hours (Example):</span> <span>{previousHours}</span></p>
                         <p><span>Current Pay Period:</span> <span>{payPeriodStart} - {payPeriodEnd}</span></p>
                     </div>
                 </div>

            </main>

            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} GoTutor Academy. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default TutorHours;