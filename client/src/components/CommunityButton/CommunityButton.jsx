import React, { useRef, useState } from "react";
import './CommunityButton.css'
function CommunityButton({ onClose }) {
  const dialogRef = useRef(null);
  const [formData, setFormData] = useState({
    first: "",
    last: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errorMessage, setErrorMessage] = useState("");

  const updateForm = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    // Password validation: at least 8 characters, one uppercase, one lowercase, one digit, one special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setErrorMessage("Password must be at least 8 characters long, with uppercase, lowercase, a number, and a special character.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    
    // Submit form data (e.g., send to your backend)
    console.log("Community sign-up data:", formData);
    onClose();
  };

  return (
    <div 
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <dialog ref={dialogRef} open className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="modal-header">
          <h2>Join Our Community</h2>
          <p>
            Become part of our vibrant tutoring community and unlock exclusive benefits!
          </p>
        </div>
        <form className="community-form" onSubmit={onSubmit}>
          <div className="form-row">
            <input
              type="text"
              name="first"
              placeholder="First Name"
              value={formData.first}
              onChange={updateForm}
              required
            />
            <input
              type="text"
              name="last"
              placeholder="Last Name"
              value={formData.last}
              onChange={updateForm}
              required
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={updateForm}
            required
          />
          <div className="form-row">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={updateForm}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={updateForm}
              required
            />
          </div>
          {errorMessage && (
            <div className="error-message">{errorMessage}</div>
          )}
          <button type="submit" className="wide-black">Join Now</button>
        </form>
      </dialog>
    </div>
  );
}

export default CommunityButton;
