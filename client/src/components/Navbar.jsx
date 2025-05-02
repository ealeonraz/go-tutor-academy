import { NavLink } from "react-router-dom";
import RegisterOverlayButton from '../components/RegisterOverlayButton'
import './Overlay.css'
import './Component.css'
import LoginOverlayButton from '../components/LoginOverlayButton'
import WebsiteLogo from "../assets/go-tutor-academy-logo.png";
import React, { useRef, useState } from "react";

export default function Navbar() {
  const loginRef = useRef(null);
  const registerRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const scrollToOffer = () => {
    const aboutSection = document.getElementById("what-we-offer");
    if(aboutSection){
      aboutSection.scrollIntoView({behavior:"smooth"});
    }
    
  };
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);  // Update login status after login
  };
    return (
      <div className="nav-main">
      <nav>
        <div className = "logo-small">
          <img src = {WebsiteLogo}></img>
        </div>
        
         {/* Buttons container on the right */}
    <div className="nav-buttons-container">
      <RegisterOverlayButton
        ref={registerRef}
        onSwitchToLogin={() => {
          loginRef.current?.showModal();
        }}
      />
      <LoginOverlayButton
        ref={loginRef}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => {
          registerRef.current?.showModal()
        }}
      />

      <button className="what-we-offer-button" onClick={scrollToOffer}>
        What We Offer
      </button>
    </div>
      </nav>
    </div>
  );
}

{/*
        <NavLink to = "/"> 
        Home
         </NavLink>
        <button onClick = {scrollToAbout} className = "about-button">
          About Us
        </button>
        */}