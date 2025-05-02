import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../components/overlay/Overlay.css";
import "./Page.css"
import Navbar from "../components/Navbars/Navbar";
import Footer from "../components/Footer";

const PasswordResetOverlay = ({ onClose }) => {
  const dialogRef = useRef(null);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirm: ""
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  }, []);

  const closeDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
      if (onClose) onClose();
    }
  };

  const updateForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (formData.password !== formData.confirm) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: formData.password }),
      });

      if (!response.ok) throw new Error("Reset failed");
      await response.json();
      setSuccess(true);
    } catch (error) {
      setErrorMessage("Password reset failed. The link may have expired.");
      console.error("Reset error:", error);
    }
  };

  return (
    <>
    <div className="full-page-layout">
      <Navbar/>
      <div className="blank-page"></div>
        <div className="overlay-center">
          <dialog ref={dialogRef}>
            <div className="login-flex">

                {success ? (
                <>
                    <h2>Password Updated!</h2>
                    <p>You may now log in with your new password.</p>
                </>
                ) : (
                <>
                    <h2>Set a New Password</h2>
                    <form onSubmit={onSubmit}>
                    <label htmlFor="password">New Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={updateForm}
                        required
                    />

                    <label htmlFor="confirm">Confirm Password</label>
                    <input
                        type="password"
                        id="confirm"
                        name="confirm"
                        value={formData.confirm}
                        onChange={updateForm}
                        required
                    />

                    {errorMessage && <div className="error-message">{errorMessage}</div>}

                    <button type="submit" className="wide-black">
                        Update Password
                    </button>
                    </form>
                </>
                )}
            </div>
          </dialog>
        </div>
        <Footer/>
      </div>
    </>
  );
};

export default PasswordResetOverlay;
