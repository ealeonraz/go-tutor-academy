import React, { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { useAuth } from "../context/AuthContext";
import "./Overlay.css";
import ForgotPassword from "./ForgotPassword";

const LoginOverlayButton = forwardRef(({ onSwitchToRegister }, ref) => {
  const dialogRef = useRef(null);

  useImperativeHandle(ref, () => ({
    showModal: () => {
      dialogRef.current?.showModal();
    },
    close: () => {
      dialogRef.current?.close();
    }
  }));


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
  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
  
    if (loginData.email !== "" && loginData.password !== "") {
      try {
        await auth.login(loginData);
      } catch (err) {
        setErrorMessage("Login failed. Please check your credentials.");
        console.error("Login error:", err);
      }
    } else {
      setErrorMessage("Please enter both email and password.");
    }
  };
  

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
            <ForgotPassword />
            <a className="login-link" onClick={(e) => {
                e.preventDefault();
                dialogRef.current?.close(); // Close the login dialog
                setTimeout(() => {
                  onSwitchToRegister?.(); // Open register via prop if provided
                }, 100); // Delay to prevent dialog conflict
              }}
            >
              Don't have an account?
            </a>

          </div>
        </dialog>
      </div>
    </>
  );
});

export default LoginOverlayButton;
