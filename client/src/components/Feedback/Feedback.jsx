import React, { useState, useEffect } from "react";
import "./Feedback.css";
import { useAuth } from '../../context/AuthContext.jsx';

  

  export default function Feedback({ appointment, user, onClose }){  
  const { user: authUser } = useAuth();
  const activeUser = user || authUser;
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    studentId: activeUser?._id || "",
    name: `${activeUser?.firstName || ""} ${activeUser?.lastName || ""}`,
    email: activeUser?.email || "",
    sessionDate: appointment?.start?.split("T")[0] || "", 
    sessionDuration: appointment?.start && appointment?.end
      ? Math.round((new Date(appointment.end) - new Date(appointment.start)) / 60000)
      : "",
    tutorId: appointment?.tutorId || "",
    subject: appointment?.subject || "",
    tutorRecommend: "",
    experienceRating: 5,
    likedMost: "",
    improvementAreas: [],
    comments: ""
  });

  useEffect(() => {
    if (activeUser) {
      setFormData(prev => ({
        ...prev,
        studentId: activeUser._id || "",
        name: `${activeUser.firstName || ""} ${activeUser.lastName || ""}`,
        email: activeUser.email || "",
      }));
    }
    
  }, [activeUser]);

  const totalSteps = 3;

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      let arr = [...formData.improvementAreas];
      if (checked) arr.push(value);
      else arr = arr.filter(x => x !== value);
      setFormData(f => ({ ...f, improvementAreas: arr }));
    } else {
      setFormData(f => ({ ...f, [name]: value }));
    }
  };
  const handleNext = () => currentStep < totalSteps && setCurrentStep(s => s + 1);
  const handleBack = () => currentStep > 1 && setCurrentStep(s => s - 1);

  const token = localStorage.getItem("token");
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/feedback", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error();
      await res.json();
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return (
        <div className="form-step">
          <h2>Session Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Name</label>
              <p className="readonly-field">{formData.name}</p>
            </div>
            <div className="form-group">
              <label>Email</label>
              <p className="readonly-field">{formData.email}</p>
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="sessionDate">Session Date *</label>
              <input type="date" id="sessionDate" name="sessionDate"
                value={formData.sessionDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="sessionDuration">Duration (mins) *</label>
              <input type="number" id="sessionDuration" name="sessionDuration"
                placeholder="Enter duration" value={formData.sessionDuration}
                onChange={handleChange} required />
            </div>
          </div>
        </div>
      );
      case 2: return (
        <div className="form-step">
          <h2>Tutor Assessment</h2>
          <div className="form-group">
            <label>Recommend your tutor?</label>
            <div className="star-rating">
              {[1,2,3,4,5].map(n => (
                <React.Fragment key={n}>
                  <input type="radio" id={`star${n}`} name="tutorRecommend" value={n}
                    onChange={handleChange}
                    checked={formData.tutorRecommend === String(n)} />
                  <label htmlFor={`star${n}`}>★</label>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="experienceRating">
              Overall Experience: <span className="slider-value">{formData.experienceRating}</span>
            </label>
            <input type="range" id="experienceRating" name="experienceRating"
              min="1" max="10"
              value={formData.experienceRating}
              onChange={handleChange} />
          </div>
        </div>
      );
      case 3: return (
        <div className="form-step">
          <h2>Additional Feedback</h2>
          <div className="form-group">
            <label htmlFor="likedMost">What did you like most?</label>
            <select id="likedMost" name="likedMost"
              value={formData.likedMost} onChange={handleChange}>
              <option value="">Select</option>
              <option value="teachingStyle">Teaching Style</option>
              <option value="subjectKnowledge">Subject Knowledge</option>
              <option value="patience">Patience</option>
              <option value="communication">Communication</option>
            </select>
          </div>
          <div className="form-group">
            <p>Areas for Improvement:</p>
            <div className="checkbox-group">
              {["Punctuality","Clarity","Engagement","Interactivity","Resources","Responsiveness"]
                .map(item => (
                  <label key={item}>
                    <input type="checkbox" name="improvementAreas" value={item}
                      onChange={handleChange}
                      checked={formData.improvementAreas.includes(item)} />
                    {item}
                  </label>
                ))
              }
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="comments">Comments</label>
            <textarea id="comments" name="comments" placeholder="Share your thoughts..."
              value={formData.comments} onChange={handleChange} />
          </div>
        </div>
      );
      default:
        return null;
    }
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>

        {submitted ? (
          <div className="success-content">
            <div className="checkmark-container">
              <svg className="checkmark" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52">
                <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                <path className="checkmark__check" fill="none"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
            <h2>Thank you for your feedback!</h2>
          </div>
        ) : (
          <>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${progressPercentage}%` }}/>
            </div>
            <form onSubmit={handleSubmit}>
              {renderStep()}
              <div className="button-group">
                {currentStep > 1 && (
                  <button type="button" onClick={handleBack} className="btn back-btn">
                    Back
                  </button>
                )}
                {currentStep < totalSteps && (
                  <button type="button" onClick={handleNext} className="btn next-btn">
                    Next
                  </button>
                )}
                {currentStep === totalSteps && (
                  <button type="submit" className="btn submit-btn">
                    Submit Feedback
                  </button>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
