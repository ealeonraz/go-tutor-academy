import React,{ useEffect, useState} from 'react';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer'; 
import "./Home.css";
import ReviewSection from '../components/ReviewSection';
import HomeImage from '../assets/HomeImage131.webp'
import RegisterOverlay from '../components/RegisterOverlayButton';
import CtaButtonOverlay from '../components/CtaButtonOverlay';
import SmartSceduling from '../assets/SmartSceduling.webp';
import PTracking from '../assets/PTracking.webp';
import Pay from '../assets/Pay.webp';
import Book from '../assets/Book.webp';
import "./Page.css";


/**
 * Home Component
 * This component serves as the homepage layout.
 * It includes:
 * - A navigation bar (Navbar)
 * - A main content section
 * - A footer (Footer)
 */

function parseJwt(token) {
  try {
    const base64url = token.split(".")[1];
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to parse JWT", error);
    return null;
  }
}

function Home() {
  
  
  const[showPopup, setShowPopup] = useState(false);
  const ctaToggle = () => {
    setShowPopup(true)
  }

  const closePopup=()=>{
    setShowPopup(false);
  }

 
    
  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <Navbar />
      
      <main className="home-content">
        <div className="home-section-main">
          {/* Left Side Call to Action */}
          <div className = "home-text">
          <h1 className="cta-heading">Learn More, <br/> Teach with Ease</h1>
          <p className="cta-description">
            A platform built for tutors and students to succeed by simplifying scheduling, 
            tracking progress, and streamlining communication.
          </p>
          <CtaButtonOverlay/>
          </div>
          <div className = "home-image">
          <img src = {HomeImage}></img>
          </div>
        </div>
      </main>



      <ReviewSection/>      
      {/* What we offer section*/}
      <section id = "what-we-offer" className = "what-we-offer">
        <h2>What We Offer</h2>
        <div className="about-us-cards">
          <div className="about-card">
            <img src= {SmartSceduling} alt="Smart Scheduling"/>
            <h4>Smart Scheduling</h4>
            <p>Our automated scheduling system eliminates conflicts and ensures smooth session planning.</p>
          </div>

          <div className="about-card">
            <img src= {PTracking} alt="Performance Tracking" />
            <h4>Performance Tracking</h4>
            <p>Students and tutors can track progress with insightful analytics and feedback tools.</p>
          </div>

          <div className="about-card">
            <img src={Pay} alt="Automated Payroll" />
            <h4>Automated Payroll</h4>
            <p>Salary calculations and time tracking made easy for tutors and administrators.</p>
          </div>

          <div className="about-card">
            <img src={Book}alt="Easy Booking" />
            <h4>Easy Booking</h4>
            <p>Students can quickly book sessions and connect with the right tutors.</p>
          </div>
        </div>
      </section>

      {/* Register Overlay - Only shows if showPopup is true */}
      {showPopup && <RegisterOverlay closePopup={closePopup} />}

      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;