import React, { useState, useRef, useContext } from "react";
import { useAuth } from "../context/AuthContext";
import "./Overlay.css";

const LoginOverlayButton = () => {
  const dialogRef = useRef(null);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const auth = useAuth();
  const [errorMessage, setErrorMessage] = useState("");

  // Opens the dialog/modal
  const openDialog = () => {
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  };

  // Closes the dialog/modal
  const closeDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  // Update form state when an input value changes
  const updateForm = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submission handler for the login form
  const onSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset any previous error message

    if(loginData.email != "" && loginData.password != "") {
      auth.login(loginData);
      return;
    }
    setErrorMessage("Login failed. Please check your credentials.");
  }

  return (
    <>
      {/* Button that opens the login overlay */}
      <div className="nav-buttons">
        <button onClick={openDialog} className="login-button">
          Log in
        </button>
      </div>

      {/* The overlay centered in the viewport */}
      <div className="overlay-center">
        <dialog
          ref={dialogRef}
          onClick={(e) => {
            // If the user clicks outside the modal content, close the dialog
            if (e.target === dialogRef.current) {
              closeDialog();
            }
          }}
        >
          <div className="login-flex">
            <h1>Login</h1>
            <form onSubmit={onSubmit}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="name@example.com"
                value={loginData.email}
                onChange={updateForm}
                required
              />

              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter password"
                value={loginData.password}
                onChange={updateForm}
                required
              />

              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}

              <button type="submit" className="wide-black">
                Sign In
              </button>
            </form>
            <a className="login-link">Forgot Password?</a>
            <a className="login-link">Don't have an account?</a>
          </div>
        </dialog>
      </div>
    </>
  );
};

export default LoginOverlayButton;
