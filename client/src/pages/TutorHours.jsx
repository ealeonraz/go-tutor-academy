import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './TutorHours.css'; // Assuming the CSS file exists and is updated

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
const ALLOWED_DURATION_DIFFERENCE = 0.1; // Allow 0.1 hours (6 mins) difference

// --- Example Pay Periods (Replace with actual data source/API call) ---
const AVAILABLE_PAY_PERIODS = [
    { id: '2024-05-01', start: '2024-05-01', end: '2024-05-15', label: 'May 1 - May 15, 2024' },
    { id: '2024-04-16', start: '2024-04-16', end: '2024-04-30', label: 'Apr 16 - Apr 30, 2024' },
    { id: '2024-04-01', start: '2024-04-01', end: '2024-04-15', label: 'Apr 1 - Apr 15, 2024' },
    // Add more periods as needed
];

// Helper to calculate duration in hours
const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    try {
        const start = new Date(`1970-01-01T${startTime}:00Z`);
        const end = new Date(`1970-01-01T${endTime}:00Z`);
        if (isNaN(start) || isNaN(end)) return 0;
        let diff = end.getTime() - start.getTime();
        if (diff < 0) {
            diff += 24 * 60 * 60 * 1000;
        }
        return diff / (1000 * 60 * 60);
    } catch (e) {
        console.error("Error calculating duration:", e);
        return 0;
    }
};

// Helper to get default OT rate
const getDefaultOvertimeRate = (regularRate) => {
    const rate = parseFloat(regularRate) || DEFAULT_REGULAR_RATE;
    return rate * DEFAULT_OVERTIME_RATE_MULTIPLIER;
};

// Helper to convert time to minutes
const timeToMinutes = (timeString) => {
    if (!timeString) return NaN;
    try {
        const [hours, minutes] = timeString.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes)) return NaN;
        return hours * 60 + minutes;
    } catch {
        return NaN;
    }
};


// --- Component ---
const TutorHours = () => {
    const [entries, setEntries] = useState([
        // Example initial entry - Note: Date might be outside default pay period now
        {
            id: Date.now(),
            date: '2024-04-25', // Example date
            student: 'Ethan',
            subject: 'Math',
            confirmationCode: 'ETHM123',
            startTime: '16:00',
            endTime: '17:30',
            regularHours: '1.5',
            overtimeHours: '0',
            regularRate: SUBJECT_RATES['Math'] || DEFAULT_REGULAR_RATE,
            overtimeRate: getDefaultOvertimeRate(SUBJECT_RATES['Math'] || DEFAULT_REGULAR_RATE),
            notes: 'Worked on Algebra chapter 5.',
            errors: {} // Start with no errors
        }
    ]);
    const [validationErrors, setValidationErrors] = useState([]); // Overall validation summary

    // --- Pay Period State ---
    const [payPeriods] = useState(AVAILABLE_PAY_PERIODS); // Use the static list
    // Default to the first (most recent) pay period in the list
    const [selectedPayPeriodId, setSelectedPayPeriodId] = useState(payPeriods[0]?.id || '');

    // Memoize the selected pay period object for easier access
    const selectedPayPeriod = useMemo(() => {
        return payPeriods.find(p => p.id === selectedPayPeriodId);
    }, [payPeriods, selectedPayPeriodId]);

    // Example static data
    const [previousHours] = useState(52);


    // --- Validation Logic ---

    // Validates numeric hour input
    const validateHourEntry = (value, fieldName = "Hours") => {
        if (value === '' || value === null || value === undefined) return `${fieldName} required.`;
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return `${fieldName} must be a number.`;
        if (numValue < 0) return `${fieldName} cannot be negative.`;
        if (numValue > 24) return `${fieldName} seems too high.`;
        return null;
    };

    // Validates numeric rate input
    const validateRate = (value, fieldName = "Rate") => {
        if (value === '' || value === null || value === undefined) return `${fieldName} required.`;
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return `${fieldName} must be a number.`;
        if (numValue <= 0) return `${fieldName} must be positive.`;
        return null;
    };

    // Validates a single entry object against the *selected* pay period
    const validateEntry = useCallback((entry, currentPayPeriod) => {
        const errors = {};
        const currentPayPeriodStart = currentPayPeriod?.start;
        const currentPayPeriodEnd = currentPayPeriod?.end;

        // Date: Required and within selected pay period
        if (!entry.date) {
            errors.date = "Date required.";
        } else if (currentPayPeriodStart && currentPayPeriodEnd && (entry.date < currentPayPeriodStart || entry.date > currentPayPeriodEnd)) {
            // Only validate range if a period is selected
            errors.date = `Date must be in selected period (${currentPayPeriodStart} - ${currentPayPeriodEnd}).`;
        } else if (!currentPayPeriodStart || !currentPayPeriodEnd) {
             // Handle case where no pay period is selected (though UI should prevent this)
             errors.date = "No pay period selected for validation.";
        }

        // Student: Required
        if (!entry.student?.trim()) errors.student = "Student name required.";
        // Subject: Required
        if (!entry.subject) errors.subject = "Subject selection required.";
        // Times: Required and logical
        if (!entry.startTime) errors.startTime = "Start time required.";
        if (!entry.endTime) errors.endTime = "End time required.";

        const duration = calculateDuration(entry.startTime, entry.endTime);
        const startMinutes = timeToMinutes(entry.startTime);
        const endMinutes = timeToMinutes(entry.endTime);

        if (entry.startTime && isNaN(startMinutes)) errors.startTime = "Invalid start time format.";
        if (entry.endTime && isNaN(endMinutes)) errors.endTime = "Invalid end time format.";

        if (entry.startTime && entry.endTime && !isNaN(startMinutes) && !isNaN(endMinutes)) {
            if (duration <= 0) errors.endTime = "End time must be after start time.";
        }

        // Hours: Required, numeric, non-negative
        const regHoursError = validateHourEntry(entry.regularHours, "Reg. Hours");
        if (regHoursError) errors.regularHours = regHoursError;
        const otHoursError = validateHourEntry(entry.overtimeHours, "OT Hours");
        if (otHoursError) errors.overtimeHours = otHoursError;

        // Hours vs Duration Check
        const regHours = parseFloat(entry.regularHours);
        const otHours = parseFloat(entry.overtimeHours);
        if (duration > 0 && !isNaN(duration) && !regHoursError && !otHoursError) {
            const enteredTotalHours = regHours + otHours;
            if (Math.abs(enteredTotalHours - duration) > ALLOWED_DURATION_DIFFERENCE) {
                errors.durationMismatch = `Entered hours (${enteredTotalHours.toFixed(2)}) mismatch duration (${duration.toFixed(2)}).`;
            }
        }

        // Rates: Required, numeric, positive
        const regRateError = validateRate(entry.regularRate, "Reg. Rate");
        if (regRateError) errors.regularRate = regRateError;
        const otRateError = validateRate(entry.overtimeRate, "OT Rate");
        if (otRateError) errors.overtimeRate = otRateError;

        return errors;
    }, []); // No dependencies needed here as pay period is passed in


    // --- Event Handlers ---
    const handleEntryChange = (id, key, value) => {
        setEntries(prevEntries =>
            prevEntries.map(entry => {
                if (entry.id === id) {
                    const updatedEntry = { ...entry, [key]: value };

                    // Auto-update rates on subject change
                    if (key === 'subject') {
                        const defaultRate = SUBJECT_RATES[value] || DEFAULT_REGULAR_RATE;
                        const currentRate = parseFloat(updatedEntry.regularRate);
                        const isDefaultOrInvalid = isNaN(currentRate) || currentRate <= 0 || currentRate === (SUBJECT_RATES[entry.subject] || DEFAULT_REGULAR_RATE);
                        if(isDefaultOrInvalid || entry.subject !== value) {
                            updatedEntry.regularRate = defaultRate;
                            updatedEntry.overtimeRate = getDefaultOvertimeRate(defaultRate);
                        }
                    }

                    // Auto-update OT rate on regular rate change
                    if (key === 'regularRate') {
                         const newRegRate = parseFloat(value);
                         if (!isNaN(newRegRate) && newRegRate > 0) {
                            const currentOtRate = parseFloat(updatedEntry.overtimeRate);
                            const prevExpectedOtRate = getDefaultOvertimeRate(entry.regularRate);
                            const isOtDefaultOrInvalid = isNaN(currentOtRate) || currentOtRate <= 0 || currentOtRate === prevExpectedOtRate;
                            if (isOtDefaultOrInvalid) {
                                updatedEntry.overtimeRate = getDefaultOvertimeRate(newRegRate);
                            }
                         }
                    }

                    // Re-validate the entry after change using the currently selected pay period
                    const entryErrors = validateEntry(updatedEntry, selectedPayPeriod);
                    const currentOverlapError = entry.errors?.overlap;
                    return {
                        ...updatedEntry,
                        errors: {
                           ...(currentOverlapError ? { overlap: currentOverlapError } : {}),
                           ...entryErrors
                        }
                    };
                }
                return entry;
            })
        );
        setValidationErrors([]); // Clear overall summary on change
    };

     const addRow = () => {
         const newId = Date.now();
         // Default date to the start of the currently selected pay period, or today if none selected
         const defaultDate = selectedPayPeriod?.start || new Date().toISOString().slice(0, 10);

         setEntries(prevEntries => [
             ...prevEntries,
             {
                 id: newId,
                 date: defaultDate, // Default to selected period start or today
                 student: '',
                 subject: '',
                 confirmationCode: '',
                 startTime: '',
                 endTime: '',
                 regularHours: '0',
                 overtimeHours: '0',
                 regularRate: DEFAULT_REGULAR_RATE,
                 overtimeRate: getDefaultOvertimeRate(DEFAULT_REGULAR_RATE),
                 notes: '',
                 errors: {}
             }
         ]);
     };

     const removeRow = (id) => {
         setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
         setValidationErrors([]);
     };

     // Handler for changing the selected pay period
     const handlePayPeriodChange = (event) => {
        setSelectedPayPeriodId(event.target.value);
        // Optional: Clear entries or re-fetch data for the new period here
        // For now, just change the period used for validation and display
        setValidationErrors([]); // Clear previous validation summary
        // We might want to re-run validation on existing entries for the new period,
        // but let's defer that to Save/Submit for now to avoid immediate error flags.
     };


    // --- Calculation Logic ---
    const calculatedTotals = useMemo(() => {
        let totalRegularHours = 0;
        let totalOvertimeHours = 0;
        let totalPay = 0;

        // Filter entries to include only those within the selected pay period *before* calculating totals
        const entriesInPeriod = entries.filter(entry => {
            if (!selectedPayPeriod) return false; // Don't include if no period selected
            return entry.date >= selectedPayPeriod.start && entry.date <= selectedPayPeriod.end;
        });


        entriesInPeriod.forEach(entry => {
            // Check if there are *any* errors for this entry before adding to totals
            const hasErrors = Object.keys(entry.errors || {}).length > 0;
            // Also re-check date range just in case validation hasn't run yet after period change
            const isDateValid = entry.date >= selectedPayPeriod.start && entry.date <= selectedPayPeriod.end;

            if (hasErrors || !isDateValid) return; // Skip entries with errors or outside current period

            const regHours = parseFloat(entry.regularHours) || 0;
            const otHours = parseFloat(entry.overtimeHours) || 0;
            const regRate = parseFloat(entry.regularRate) || 0;
            const otRate = parseFloat(entry.overtimeRate) || 0;

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
    // Depend on selectedPayPeriod as well, so totals recalculate when period changes
    }, [entries, selectedPayPeriod]);


    // --- Full Validation (including Overlaps) ---
    const runFullValidation = useCallback(() => {
        if (!selectedPayPeriod) {
            setValidationErrors(["Please select a pay period."]);
            return false; // Cannot validate without a selected period
        }

        let allEntriesValid = true;
        const overallSummaryErrors = [];
        let entriesWithUpdatedErrors = [...entries];

        // 1. Individual Entry Validation (using selected period)
        entriesWithUpdatedErrors = entriesWithUpdatedErrors.map((entry, index) => {
            // Only validate entries potentially within the selected period for efficiency
            // Though validateEntry itself checks the date range
            const entryErrors = validateEntry(entry, selectedPayPeriod);
            const currentOverlapError = entry.errors?.overlap; // Preserve existing overlap
            const combinedErrors = {
                 ...(currentOverlapError ? { overlap: currentOverlapError } : {}),
                 ...entryErrors
            };

            if (Object.keys(entryErrors).length > 0) {
                // Only flag as invalid if the error is relevant to the *selected* pay period
                // (e.g., ignore date range errors for entries clearly outside the period)
                 if (entry.date >= selectedPayPeriod.start && entry.date <= selectedPayPeriod.end) {
                    allEntriesValid = false;
                 }
                // Add specific errors to the overall summary list
                Object.entries(entryErrors).forEach(([field, message]) => {
                    overallSummaryErrors.push(`Row ${index + 1} (${entry.date || 'No Date'}): ${field} - ${message}`);
                });
            }
            return { ...entry, errors: combinedErrors };
        });

        // 2. Overlap Check (only consider entries within the selected pay period)
        const entriesInPeriodForOverlap = entriesWithUpdatedErrors.filter(
            e => e.date >= selectedPayPeriod.start && e.date <= selectedPayPeriod.end
        );

        const sortedEntries = [...entriesInPeriodForOverlap].sort((a, b) => {
            // Sort by date first, then time
            if (a.date < b.date) return -1;
            if (a.date > b.date) return 1;
            const startA = timeToMinutes(a.startTime);
            const startB = timeToMinutes(b.startTime);
            if (isNaN(startA)) return 1; // Invalid times sort later
            if (isNaN(startB)) return -1;
            return startA - startB; // Sort by start time
        });

        // Reset only overlap errors before checking again
        // Important: Update the main state array `entriesWithUpdatedErrors`
        entriesWithUpdatedErrors = entriesWithUpdatedErrors.map(e => ({...e, errors: {...e.errors, overlap: undefined }}));


        for (let i = 1; i < sortedEntries.length; i++) {
            const prevEntry = sortedEntries[i - 1];
            const currentEntry = sortedEntries[i];

            // No need to check date again, already filtered
            const prevEndTimeMinutes = timeToMinutes(prevEntry.endTime);
            const currentStartTimeMinutes = timeToMinutes(currentEntry.startTime);

            if (!isNaN(prevEndTimeMinutes) && !isNaN(currentStartTimeMinutes) && currentStartTimeMinutes < prevEndTimeMinutes) {
                 allEntriesValid = false; // Found an overlap
                 const overlapErrorMsg = `Overlaps with ${prevEntry.student || 'N/A'} (${prevEntry.startTime}-${prevEntry.endTime})`;
                 const prevOverlapErrorMsg = `Overlaps with ${currentEntry.student || 'N/A'} (${currentEntry.startTime}-${currentEntry.endTime})`;

                 // Find original entries in the main updated array and add overlap errors
                 const currentEntryRef = entriesWithUpdatedErrors.find(e => e.id === currentEntry.id);
                 const prevEntryRef = entriesWithUpdatedErrors.find(e => e.id === prevEntry.id);

                 if (currentEntryRef) {
                     currentEntryRef.errors.overlap = overlapErrorMsg;
                     overallSummaryErrors.push(`Row ${entriesWithUpdatedErrors.findIndex(e => e.id === currentEntry.id) + 1} (${currentEntry.date}): Overlap - ${overlapErrorMsg}`);
                 }
                 if (prevEntryRef && !prevEntryRef.errors.overlap) {
                      prevEntryRef.errors.overlap = prevOverlapErrorMsg;
                      overallSummaryErrors.push(`Row ${entriesWithUpdatedErrors.findIndex(e => e.id === prevEntry.id) + 1} (${prevEntry.date}): Overlap - ${prevOverlapErrorMsg}`);
                 }
            }
        }

        // Update state and summary errors
        setEntries(entriesWithUpdatedErrors);
        setValidationErrors([...new Set(overallSummaryErrors)]);

        return allEntriesValid;
    // Depend on selectedPayPeriod now
    }, [entries, validateEntry, selectedPayPeriod]);


    // --- Save/Submit Actions ---
    const saveTimesheet = () => {
        const isValid = runFullValidation();
        if (!isValid) {
            alert('Please fix the errors indicated in the summary and rows before saving.');
            console.log("Validation Errors:", validationErrors);
            return;
        }
        // Filter entries to save only those within the selected period
        const entriesToSave = entries
            .filter(e => selectedPayPeriod && e.date >= selectedPayPeriod.start && e.date <= selectedPayPeriod.end)
            .map(({ errors, ...rest }) => rest); // Remove error objects before saving

        if (entriesToSave.length === 0 && entries.length > 0) {
             alert(`No entries fall within the selected pay period (${selectedPayPeriod?.label || ''}). Nothing to save for this period.`);
             return;
        }

        console.log(`Saving timesheet data for period ${selectedPayPeriod?.label}:`, entriesToSave);
        alert(`Timesheet Draft Saved for ${selectedPayPeriod?.label}! (Data logged to console)`);
    };

     const submitTimesheet = () => {
         const isValid = runFullValidation();
         if (!isValid) {
              alert('Please fix all errors before submitting for approval.');
              console.log("Validation Errors:", validationErrors);
              return;
         }
         // Filter entries to submit only those within the selected period
         const entriesToSubmit = entries
            .filter(e => selectedPayPeriod && e.date >= selectedPayPeriod.start && e.date <= selectedPayPeriod.end)
            .map(({ errors, ...rest }) => rest); // Remove error objects

         if (entriesToSubmit.length === 0) {
             alert(`No entries found within the selected pay period (${selectedPayPeriod?.label || ''}) to submit.`);
             return;
         }

         console.log(`Submitting timesheet data for period ${selectedPayPeriod?.label}:`, entriesToSubmit);
         alert(`Timesheet Submitted for Approval for ${selectedPayPeriod?.label}! (Data logged to console)`);
         setValidationErrors([]); // Clear errors on successful submit
     };


    // --- Subject Options ---
    const subjectOptions = Object.keys(SUBJECT_RATES);


    // --- JSX Rendering ---
    return (
        <div className="timesheet-container">
            {/* Header */}
            <header className="header">
                <div className="logo">GoTutor Session Log</div>
                <div className="profile-icon" title="User Profile (Placeholder)">👤</div>
            </header>

            {/* Main Content */}
            <main className="main-content">
                <div className="timesheet-header">
                    <h2>My Session Log</h2>
                    {/* Pay Period Selector */}
                    <div className="pay-period-selector">
                        <label htmlFor="payPeriodSelect">Pay Period: </label>
                        <select
                            id="payPeriodSelect"
                            value={selectedPayPeriodId}
                            onChange={handlePayPeriodChange}
                            aria-label="Select Pay Period"
                        >
                            {payPeriods.length === 0 && <option disabled>Loading periods...</option>}
                            {payPeriods.map(period => (
                                <option key={period.id} value={period.id}>
                                    {period.label} ({period.start} to {period.end})
                                </option>
                            ))}
                        </select>
                    </div>
                    <button className="report-button">Timesheet Summary Report</button>
                </div>

                {/* Validation Summary Area (Overall Errors) */}
                {validationErrors.length > 0 && (
                    <div className="validation-summary">
                        <strong>Please review the following overall issues:</strong>
                        <ul>
                            {validationErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Session Entry Grid */}
                <div className="timesheet-grid">
                    {/* Grid Header */}
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
                        <div className="header-errors">Row Errors</div> {/* Header for Error Column */}
                        <div>Action</div>
                    </div>
                    {/* Grid Rows */}
                    {entries.length === 0 && (
                         <div className="grid-row-empty">
                             No sessions added yet. Click "+ Add Session" to start.
                         </div>
                    )}
                    {entries.map((entry, index) => {
                         const duration = calculateDuration(entry.startTime, entry.endTime);
                         const estimatedRowPay = ( (parseFloat(entry.regularHours) || 0) * (parseFloat(entry.regularRate) || 0) )
                                              + ( (parseFloat(entry.overtimeHours) || 0) * (parseFloat(entry.overtimeRate) || 0) );
                         const rowErrors = entry.errors || {};
                         const hasErrors = Object.keys(rowErrors).length > 0;
                         const errorMessages = Object.entries(rowErrors).map(([key, msg]) => ({ key, msg }));

                         // Determine if the row is within the selected pay period for visual indication (optional)
                         const isOutsidePeriod = selectedPayPeriod && (entry.date < selectedPayPeriod.start || entry.date > selectedPayPeriod.end);

                        return (
                            // Add classes for errors or being outside the selected period
                            <div className={`grid-row ${hasErrors ? 'row-with-errors' : ''} ${isOutsidePeriod ? 'row-outside-period' : ''}`} key={entry.id}>
                                {/* --- Input Fields --- */}
                                {/* Date */}
                                <div className="input-wrapper">
                                    <input type="date" value={entry.date} onChange={e => handleEntryChange(entry.id, 'date', e.target.value)} aria-label={`Date row ${index + 1}`} style={rowErrors.date ? { borderColor: 'red' } : {}} />
                                </div>
                                {/* Student */}
                                <div className="input-wrapper">
                                    <input type="text" placeholder="Student Name" value={entry.student} onChange={e => handleEntryChange(entry.id, 'student', e.target.value)} aria-label={`Student row ${index + 1}`} style={rowErrors.student ? { borderColor: 'red' } : {}}/>
                                </div>
                                 {/* Subject */}
                                 <div className="input-wrapper">
                                     <select value={entry.subject} onChange={e => handleEntryChange(entry.id, 'subject', e.target.value)} aria-label={`Subject row ${index + 1}`} style={rowErrors.subject ? { borderColor: 'red' } : {}}>
                                         <option value="" disabled>Select Subject</option>
                                         {subjectOptions.map(sub => (<option key={sub} value={sub}>{sub}</option>))}
                                     </select>
                                 </div>
                                {/* Confirmation Code */}
                                <div className="input-wrapper">
                                    <input type="text" placeholder="Code (Optional)" value={entry.confirmationCode} onChange={e => handleEntryChange(entry.id, 'confirmationCode', e.target.value)} aria-label={`Conf Code row ${index + 1}`} style={rowErrors.confirmationCode ? { borderColor: 'red' } : {}}/>
                                </div>
                                 {/* Start Time */}
                                 <div className="input-wrapper">
                                     <input type="time" value={entry.startTime} onChange={e => handleEntryChange(entry.id, 'startTime', e.target.value)} aria-label={`Start Time row ${index + 1}`} style={rowErrors.startTime || rowErrors.overlap ? { borderColor: 'red' } : {}}/>
                                 </div>
                                 {/* End Time */}
                                 <div className="input-wrapper">
                                     <input type="time" value={entry.endTime} onChange={e => handleEntryChange(entry.id, 'endTime', e.target.value)} aria-label={`End Time row ${index + 1}`} style={rowErrors.endTime || rowErrors.overlap ? { borderColor: 'red' } : {}}/>
                                 </div>
                                 {/* Duration (Display Only) */}
                                <div className="display-field" title="Calculated Duration (Hours)">
                                    {duration > 0 && !isNaN(duration) ? duration.toFixed(2) : 'N/A'}
                                </div>
                                 {/* Regular Hours */}
                                 <div className="input-wrapper">
                                     <input type="number" step="0.01" min="0" placeholder="0.00" value={entry.regularHours} onChange={e => handleEntryChange(entry.id, 'regularHours', e.target.value)} aria-label={`Reg Hours row ${index + 1}`} style={rowErrors.regularHours || rowErrors.durationMismatch ? { borderColor: 'red' } : {}}/>
                                 </div>
                                 {/* Overtime Hours */}
                                 <div className="input-wrapper">
                                     <input type="number" step="0.01" min="0" placeholder="0.00" value={entry.overtimeHours} onChange={e => handleEntryChange(entry.id, 'overtimeHours', e.target.value)} aria-label={`OT Hours row ${index + 1}`} style={rowErrors.overtimeHours || rowErrors.durationMismatch ? { borderColor: 'red' } : {}}/>
                                 </div>
                                 {/* Regular Rate */}
                                 <div className="input-wrapper">
                                     <input type="number" step="0.01" min="0" placeholder="Rate" value={entry.regularRate} onChange={e => handleEntryChange(entry.id, 'regularRate', e.target.value)} aria-label={`Reg Rate row ${index + 1}`} style={rowErrors.regularRate ? { borderColor: 'red' } : {}}/>
                                 </div>
                                 {/* Overtime Rate */}
                                  <div className="input-wrapper">
                                      <input type="number" step="0.01" min="0" placeholder="OT Rate" value={entry.overtimeRate} onChange={e => handleEntryChange(entry.id, 'overtimeRate', e.target.value)} aria-label={`OT Rate row ${index + 1}`} style={rowErrors.overtimeRate ? { borderColor: 'red' } : {}}/>
                                  </div>
                                 {/* Notes */}
                                 <div className="input-wrapper">
                                     <textarea placeholder="Session notes..." value={entry.notes} onChange={e => handleEntryChange(entry.id, 'notes', e.target.value)} aria-label={`Notes row ${index + 1}`} style={rowErrors.notes ? { borderColor: 'red' } : {}}/>
                                 </div>
                                 {/* Estimated Pay (Display Only) */}
                                 <div className={`display-field ${isOutsidePeriod ? 'pay-outside-period' : ''}`} title="Estimated Pay for this Session">
                                     {/* Show $0.00 if row has errors OR is outside selected period */}
                                     ${!hasErrors && !isOutsidePeriod && estimatedRowPay > 0 ? estimatedRowPay.toFixed(2) : '0.00'}
                                 </div>

                                 {/* --- Row Error Area --- */}
                                 <div className="row-error-area">
                                     {/* Show errors only if row is within the selected period */}
                                     {hasErrors && !isOutsidePeriod && (
                                         <ul>
                                             {errorMessages.map(({ key, msg }) => (
                                                 <li key={key}>{msg}</li>
                                             ))}
                                         </ul>
                                     )}
                                     {isOutsidePeriod && (
                                        <span className="error-outside-period">(Outside selected period)</span>
                                     )}
                                 </div>

                                 {/* --- Actions --- */}
                                 <div className="input-wrapper action-wrapper">
                                      <button onClick={() => removeRow(entry.id)} className="action-button" title="Remove this session" aria-label={`Remove session row ${index + 1}`}>X</button>
                                 </div>
                            </div>
                        );
                    })}
                </div>

                {/* Add Row Button & Submit Actions */}
                 <div className="grid-actions">
                     <button onClick={addRow} className="add-row-button" disabled={!selectedPayPeriod}>+ Add Session</button> {/* Disable if no period selected */}
                      <div className="grid-submit-buttons">
                          <button onClick={saveTimesheet} className="save-button" disabled={!selectedPayPeriod}>Save Draft</button>
                          <button onClick={submitTimesheet} className="submit-button" disabled={!selectedPayPeriod}>Submit for Approval</button>
                      </div>
                 </div>


                {/* Overall Summary Section - Now reflects the SELECTED pay period */}
                <div className="timesheet-summary">
                    <div className="summary-title">
                        Summary for Period: {selectedPayPeriod ? selectedPayPeriod.label : 'No Period Selected'}
                    </div>
                    {selectedPayPeriod ? (
                        <div className="summary-details">
                            {/* Totals are now calculated based on filtered entries */}
                            <p><span>Total Regular Hours:</span> <span>{calculatedTotals.totalRegularHours.toFixed(2)}</span></p>
                            <p><span>Total Overtime Hours:</span> <span>{calculatedTotals.totalOvertimeHours.toFixed(2)}</span></p>
                            <p><span>Total Combined Hours:</span> <span>{calculatedTotals.totalCombinedHours.toFixed(2)}</span></p>
                            <p><span style={{fontWeight: 'bold'}}>Total Estimated Pay:</span> <span style={{fontSize: '1.1em', color: '#28a745'}}>${calculatedTotals.totalPay.toFixed(2)}</span></p>
                            <p><span>Previous Hours (Example):</span> <span>{previousHours}</span></p>
                            <p><span>Selected Pay Period:</span> <span>{selectedPayPeriod.start} - {selectedPayPeriod.end}</span></p>
                        </div>
                    ) : (
                        <p>Please select a pay period to see the summary.</p>
                    )}
                </div>

            </main>

            {/* Footer */}
            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} GoTutor Academy. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default TutorHours;