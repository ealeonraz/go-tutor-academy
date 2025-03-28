import { NavLink } from "react-router-dom";
import RegisterOverlay from '../components/RegisterOverlayButton'
import './Overlay.css'
import LoginOverlay from '../components/LoginOverlayButton'
import WebsiteLogo from '../assets/WebsiteLogo.webp'



export default function Navbar() {
  const scrollToOffer = () => {
    const aboutSection = document.getElementById("what-we-offer");
    if(aboutSection){
      aboutSection.scrollIntoView({behavior:"smooth"});
    }
  };
    return (
      <div className="nav-main">
      <nav>
        <div className = "website-logo">
          <img src = {WebsiteLogo}></img>
        </div>
        
         {/* Buttons container on the right */}
    <div className="nav-buttons-container">
      <RegisterOverlay />
      <LoginOverlay />
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