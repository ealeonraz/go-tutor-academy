import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ReviewSection from '../components/ReviewSection';
import RegisterOverlay from '../components/RegisterOverlayButton';
import CtaButtonOverlay from '../components/CtaButtonOverlay';
import LoginOverlayButton from "../components/LoginOverlayButton";
import RegisterOverlayButton from "../components/RegisterOverlayButton";
import CommunityButton from '../components/CommunityButton';

// Images
import HomeImage from '../assets/HomeImage131.webp';
import SmartSceduling from '../assets/SmartSceduling.webp';
import PTracking from '../assets/PTracking.webp';
import Pay from '../assets/Pay.webp';
import Book from '../assets/Book.webp';

// Icons (including new ones)
import { 
  CalculatorIcon, 
  ScienceIcon, 
  BookIcon, 
  GlobeIcon, 
  ComputerIcon, 
  SchoolIcon,
  HistoryIcon,
  ArtIcon,
  MusicIcon,
  LanguagesIcon,
  ChemistryIcon,
  BiologyIcon,
  EconomicsIcon,
  PhilosophyIcon
} from '../components/Icons';

// Styles
import "./Home.css";
import "./Page.css";

function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();


  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="home-container">
      {/* Navigation Bar & Overlays */}
      <Navbar />

      {/* CTA / HERO SECTION */}
      <main className="home-content">
        <div className="home-section-main">
          <div className="home-text">
            <h1 className="cta-heading">
              Learn More, <br /> Teach with Ease
            </h1>
            <p className="cta-description">
              A platform built for tutors and students to succeed by simplifying scheduling, tracking progress, and streamlining communication.
            </p>
            <CtaButtonOverlay />
          </div>
          <div className="home-image">
            <img src={HomeImage} alt="Learning Platform" />
          </div>
        </div>
      </main>


      {/* About & Subjects Section */}
      <section className="about-section">
        {/* About Us Content */}
        <div className="about-content">
          <h2>About Us</h2>
          <p>
            Our tutoring platform connects students with expert tutors for personalized learning.
            We believe in building confidence through knowledge, offering one-on-one sessions tailored to each student’s needs.
          </p>
          <p>
            With a focus on strong fundamentals and interactive teaching, we help learners excel in their courses and foster a love of learning.
          </p>
        </div>

        {/* Subjects We Tutor List */}
        <div className="subjects-list">
          <h2>Subjects We Tutor</h2>
          <ul>
            <li><CalculatorIcon /><span>Mathematics</span></li>
            <li><ScienceIcon /><span>Science</span></li>
            <li><BookIcon /><span>English Literature</span></li>
            <li><GlobeIcon /><span>Social Studies</span></li>
            <li><ComputerIcon /><span>Computer Science</span></li>
            <li><SchoolIcon /><span>Test Prep</span></li>
            <li><HistoryIcon /><span>History</span></li>
            <li><ArtIcon /><span>Art</span></li>
            <li><MusicIcon /><span>Music</span></li>
            <li><LanguagesIcon /><span>Foreign Languages</span></li>
            <li><ChemistryIcon /><span>Chemistry</span></li>
            <li><BiologyIcon /><span>Biology</span></li>
            <li><EconomicsIcon /><span>Economics</span></li>
            <li><PhilosophyIcon /><span>Philosophy</span></li>
          </ul>
        </div>
      </section>

      {/* What We Offer Section */}
      <section id="what-we-offer" className="what-we-offer">
        <h2>What We Offer</h2>
        <div className="about-us-cards">
          <div className="about-card">
            <img src={SmartSceduling} alt="Smart Scheduling" />
            <h4>Smart Scheduling</h4>
            <p>Our automated scheduling system eliminates conflicts and ensures smooth session planning.</p>
          </div>
          <div className="about-card">
            <img src={PTracking} alt="Performance Tracking" />
            <h4>Performance Tracking</h4>
            <p>Students and tutors can track progress with insightful analytics and feedback tools.</p>
          </div>
          <div className="about-card">
            <img src={Pay} alt="Automated Payroll" />
            <h4>Automated Payroll</h4>
            <p>Salary calculations and time tracking made easy for tutors and administrators.</p>
          </div>
          <div className="about-card">
            <img src={Book} alt="Easy Booking" />
            <h4>Easy Booking</h4>
            <p>Quickly connect students with the right tutor for their needs.</p>
          </div>
        </div>
      </section>

      {/* Our Impact Section */}
      <section id="impact" className="impact-section">
        <div className="impact-grid">
          <div className="impact-text">
            <h2>Our Impact</h2>
            <p>
              We empower learners and educators worldwide. Our platform fosters success by connecting students with dedicated tutors, resulting in thousands of productive sessions every day.
            </p>
            <button className="impact-btn" onClick={() => setShowPopup(true)}>
              Join Our Community
            </button>
          </div>
          <div className="impact-stats">
            <div className="counter">
              <span className="number">5000+</span>
              <span className="label">Sessions</span>
            </div>
            <div className="counter">
              <span className="number">2000+</span>
              <span className="label">Students</span>
            </div>
            <div className="counter">
              <span className="number">150+</span>
              <span className="label">Tutors</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section section-white">
        <ReviewSection />
      </section>

      {showPopup && <CommunityButton onClose={closePopup} />}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
