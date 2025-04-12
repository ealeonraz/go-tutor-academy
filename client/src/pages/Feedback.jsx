import React, { useState } from "react";
import "./Feedback.css";

// The Feedback component manages a multi-step feedback form for tutor sessions.
function Feedback() {
  // currentStep: Tracks the current form step (1, 2, or 3)
  const [currentStep, setCurrentStep] = useState(1);
  
  // submitted: Flag to indicate whether the form was successfully submitted.
  const [submitted, setSubmitted] = useState(false);
  
  // formData: Holds all user inputs from the form.
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    sessionDate: "",
    sessionDuration: "",
    tutorRecommend: "",
    experienceRating: 5,
    likedMost: "",
    improvementAreas: [],
    comments: ""
  });

  // Total number of steps in the multi-step form.
  const totalSteps = 3;

  /**
   * handleChange: Updates formData state when a field value changes.
   * - For checkboxes, it adds or removes values from the improvementAreas array.
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      // Create a copy of the current improvementAreas array.
      let newArray = [...formData.improvementAreas];
      if (checked) {
        // Add the new value if checked.
        newArray.push(value);
      } else {
        // Remove the value if unchecked.
        newArray = newArray.filter((item) => item !== value);
      }
      setFormData({ ...formData, improvementAreas: newArray });
    } else {
      // Update the corresponding property in formData.
      setFormData({ ...formData, [name]: value });
    }
  };

  /**
   * handleNext: Advances the form to the next step if not at the last step.
   */
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  /**
   * handleBack: Moves the form back to the previous step if not at the first step.
   */
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  /**
   * handleSubmit: Sends form data to the backend API and sets the submitted flag on success.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior.
    try {
      // Send a POST request to the backend endpoint with formData as JSON.
      const response = await fetch("http://localhost:4000/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      // Check if the response is successful.
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Parse the JSON response.
      const result = await response.json();
      console.log("Feedback stored with id:", result.id);
      // Set submitted flag to true to show the success message.
      setSubmitted(true);
    } catch (err) {
      console.error(
        `Failed to create review for ${formData.name}, ${formData.email}`,
        err
      );
    }
  };

  /**
   * renderStep: Returns the JSX for the current form step.
   */
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-step">
            <h2>Session Information</h2>
            <div className="form-grid">
              {/* Name Input Field */}
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Email Input Field */}
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-grid">
              {/* Session Date Input Field */}
              <div className="form-group">
                <label htmlFor="sessionDate">Session Date *</label>
                <input
                  type="date"
                  id="sessionDate"
                  name="sessionDate"
                  value={formData.sessionDate}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Session Duration Input Field */}
              <div className="form-group">
                <label htmlFor="sessionDuration">Duration (mins) *</label>
                <input
                  type="number"
                  id="sessionDuration"
                  name="sessionDuration"
                  placeholder="Enter duration"
                  value={formData.sessionDuration}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-step">
            <h2>Tutor Assessment</h2>
            <div className="form-group">
              <label>How likely are you to recommend your tutor?</label>
              <div className="star-rating">
                {/* Create star rating inputs from 1 to 5 */}
                {[1, 2, 3, 4, 5].map((num) => (
                  <React.Fragment key={num}>
                    <input
                      type="radio"
                      id={`star${num}`}
                      name="tutorRecommend"
                      value={num}
                      onChange={handleChange}
                      checked={formData.tutorRecommend === String(num)}
                    />
                    <label htmlFor={`star${num}`}>★</label>
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="experienceRating">
                Overall Experience:{" "}
                <span className="slider-value">{formData.experienceRating}</span>
              </label>
              {/* Slider input for overall experience */}
              <input
                type="range"
                id="experienceRating"
                name="experienceRating"
                min="1"
                max="10"
                value={formData.experienceRating}
                onChange={handleChange}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="form-step">
            <h2>Additional Feedback</h2>
            <div className="form-group">
              <label htmlFor="likedMost">
                What did you like most about your session?
              </label>
              <select
                id="likedMost"
                name="likedMost"
                value={formData.likedMost}
                onChange={handleChange}
              >
                <option value="">Select an option</option>
                <option value="teachingStyle">Teaching Style</option>
                <option value="subjectKnowledge">Subject Knowledge</option>
                <option value="patience">Patience</option>
                <option value="communication">Communication</option>
              </select>
            </div>
            <div className="form-group">
              <p>Areas for Improvement (check all that apply):</p>
              <div className="checkbox-group">
                {/* Render checkboxes for improvement areas */}
                {[
                  "Punctuality",
                  "Clarity",
                  "Engagement",
                  "Interactivity",
                  "Resources",
                  "Responsiveness"
                ].map((item) => (
                  <label key={item}>
                    <input
                      type="checkbox"
                      name="improvementAreas"
                      value={item}
                      onChange={handleChange}
                      checked={formData.improvementAreas.includes(item)}
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="comments">Additional Comments</label>
              <textarea
                id="comments"
                name="comments"
                placeholder="Share your thoughts..."
                value={formData.comments}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Calculate progress percentage for the progress bar.
  const progressPercentage = (currentStep / totalSteps) * 100;

  // If the form has been submitted, display a success message with an animated checkmark.
  if (submitted) {
    return (
      <div className="feedback-page">
        <div className="success-card">
          <div className="checkmark-container">
            <svg
              className="checkmark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle
                className="checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                className="checkmark__check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
          </div>
          <h2>Thank you for your feedback!</h2>
        </div>
      </div>
    );
  }

  // Main rendering of the multi-step feedback form.
  return (
    <div className="feedback-page">
      <div className="form-card">
        {/* Progress bar displays current step progress */}
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Render the current step's form fields */}
          {renderStep()}
          <div className="button-group">
            {/* Back button (only visible if not on the first step) */}
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="btn back-btn"
              >
                Back
              </button>
            )}
            {/* Next button (only visible if not on the final step) */}
            {currentStep < totalSteps && (
              <button
                type="button"
                onClick={handleNext}
                className="btn next-btn"
              >
                Next
              </button>
            )}
            {/* Submit button (only visible on the final step) */}
            {currentStep === totalSteps && (
              <button type="submit" className="btn submit-btn">
                Submit Feedback
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Feedback;
