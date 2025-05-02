import React, { useState, useRef } from "react";
import "./Overlay.css";

const RegisterOverlayButton = () => {
  const dialogRef = useRef(null);

  const [registerData, setRegisterData] = useState({
    first: "",
    last: "",
    email: "",
    role: "student",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const openDialog = () => {
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  };

  const closeDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  const updateForm = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(registerData.password)) {
      setErrorMessage(
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."
      );
      return;
    }

    // Check if passwords match
    if (registerData.password !== registerData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        throw new Error("Failed to create account.");
      }

      const result = await response.json();

      closeDialog();

    } catch (error) {
      console.error("Failed to create account:", error);
      setErrorMessage("Account creation failed. Please try again.");
    }
  };

  return (
    <>
      <div className="nav-buttons">
        <button onClick={openDialog} className="register-button">
          Register
        </button>
      </div>

      <div className="overlay-center">
        <dialog
          ref={dialogRef}
          onClick={(e) => {
            if (e.target === dialogRef.current) {
              closeDialog();
            }
          }}
        >
          <div className="login-flex">
            <h1>Register</h1>
            <form onSubmit={onSubmit}>
              <label htmlFor="first">First Name:</label>
              <input
                type="text"
                id="first"
                name="first"
                placeholder="First Name"
                value={registerData.first}
                onChange={updateForm}
                required
              />

              <label htmlFor="last">Last Name:</label>
              <input
                type="text"
                id="last"
                name="last"
                placeholder="Last Name"
                value={registerData.last}
                onChange={updateForm}
                required
              />

              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="name@example.com"
                value={registerData.email}
                onChange={updateForm}
                required
              />

              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter password"
                value={registerData.password}
                onChange={updateForm}
                required
              />

              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm password"
                value={registerData.confirmPassword}
                onChange={updateForm}
                required
              />

              {errorMessage && <div className="error-message">{errorMessage}</div>}

              <button type="submit" className="wide-black">
                Create Account
              </button>
            </form>
            <a className="login-link">Already have an account?</a>
          </div>
        </dialog>
      </div>
    </>
  );
};

export default RegisterOverlayButton;
