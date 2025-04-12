import { NavLink } from "react-router-dom";
import WebsiteLogo from '../assets/WebsiteLogo.webp'


export default function Footer() {
  
  return (
    <footer className="footer">
  <div className="footer-content">
    <div className="footer-logo">
      <img src={WebsiteLogo} alt="Website Logo" />
    </div>

    {/* Contact Information */}
    <div className="footer-contact">
      <p className="footer-phone">Phone: +1 (123) 456-7890</p>
      <p className="footer-email">Email: gotutor@gmail.com</p>
    </div>

    {/* Copyright Notice */}
    <div className="footer-copyright">
      <p>&copy; 2025 GoTutorAcademy. All Rights Reserved.</p>
    </div>
  </div>
</footer>
    
  );
}
