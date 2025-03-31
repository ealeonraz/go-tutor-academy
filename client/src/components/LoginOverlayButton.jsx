import React, { useState, useRef } from "react";
import "./Overlay.css";

const LoginOverlayButton = () => {
  const dialogRef = useRef(null);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
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
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
  
    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST", // Using POST to send login credentials
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      if (!response.ok) {
        throw new Error("Failed to login");
      }
  
      const result = await response.json();
  
      // Assume result includes a property called 'token'
      localStorage.setItem("token", result.token);
      console.log("Login successful, token stored:", result.token);
      closeDialog();
  
      // Forcefully redirect to student dashboard
      window.location.href = "/studentDashboard";  // Redirect to student dashboard
      
  
      // Optionally, call the success handler to update login state
      onLoginSuccess(); // This is still useful for managing state on the parent component
  
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("Login failed. Please check your credentials.");
    }
  };
  return (
    <>
      {/* Login Button */}
      <div className="nav-buttons">
        <button onClick={openDialog} className="login-button">
          Log in
        </button>
      </div>

      {/* Login Overlay */}
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