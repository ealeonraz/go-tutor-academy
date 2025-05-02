import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import React, { useRef } from "react";




const CtaButtonOverlay = () => {

    const dialogRef = useRef(null);

    const [registerData, setRegisterData] = useState({
        first: "",
        last: "",
        email: "",
        role: "student",
        password: "",
        confirmPassword: ""
    });

    const [errorMessage, setErrorMessage] = useState("");

    const [isNew, setIsNew] = useState(true);
    const params = useParams();
    const navigate = useNavigate();

    const openDialog = () => {
        if (dialogRef.current && !dialogRef.current.open) {
            dialogRef.current.showModal(); // Ensure it's only called if it's not already open
        }
    };

    const closeDialog = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
        }
    };

    const updateForm = (e) => {
        const{name, value} = e.target;
        setRegisterData((prev) => ({
            ...prev,
            [name]:value
        }));
        
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        // reset error message
        setErrorMessage("");

        // Email validation
        const email = registerData.email;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        // Password validation
        const password = registerData.password;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        
        if (!passwordRegex.test(password)) {
            setErrorMessage("Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.");
            return;
        }   

        // Check if passwords match
        if (registerData.password !== registerData.confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }
        
        try {
            const response = await fetch("http://localhost:4000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify(registerData),
            });

            if (!response.ok) {
                throw new error("Could not fetch database");
            }

            const result = await response.json();
            console.log(result.id);
            closeDialog();

        } catch(error) {
            console.error("Failed to create account");
        }
    };

  return (
        <>
            {/* Cta Button */}
            <div className="nav-buttons">
                <button 
                onClick={openDialog}
                className="cta-button">
                    Search For Tutors Now!
                </button>
            </div>
        
            {/* Register Overlay */}
            <div className="overlay-center">
                <dialog 
                ref={dialogRef} 
                onClick={(e) => {
                    if (e.target === dialogRef.current) {
                    closeDialog();
                    }
                }}>
                    <div className="login-flex">
                        <h1>Register</h1>
                        <form action="" onSubmit={onSubmit}>
                            <label htmlFor="first" required>
                                First Name:
                            </label>
                            <input type="text" id="first" name="first"
                                placeholder="Enter First Name" 
                                value={registerData.firstName}
                                onChange={updateForm}
                                required/>

                                <label htmlFor="last" required>
                                Last Name:
                            </label>
                            <input type="text" id="last" name="last"
                                placeholder="Enter Last Name" 
                                value={registerData.lastName}
                                onChange={updateForm}
                                required/>

                            <label htmlFor="email" required>
                                Email:
                            </label>
                            <input type="text" id="email" name="email"
                                placeholder="name@example.com" 
                                value={registerData.email}
                                onChange={updateForm}
                                required/>

                            <label htmlFor="password-0" required>
                                Password:
                            </label>
                            <input type="password" id="password-0" name="password"
                                placeholder="Enter password" 
                                value={registerData.password}
                                onChange={updateForm}
                            />

                            <label htmlFor="password-1" required>
                                Re-enter Password:
                            </label>
                            <input type="password" id="password-1" name="confirmPassword"
                                placeholder="Re-type password"
                                value={registerData.confirmPassword}
                                onChange={updateForm}
                            />
                            {errorMessage && 
                                <div className="error-message">
                                    {errorMessage}
                                </div>
                            }
                            <button type="submit" value="Create Account" className="wide-black" onClick={onSubmit}>Create Account</button>
                        </form>
                        <a className="login-link">Already have an account?</a>
                    </div>
                </dialog>
            </div>
        </>
    );
  
}

// escape key
//LoginOverlay.addEventListener()

export default CtaButtonOverlay;

