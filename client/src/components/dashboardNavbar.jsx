import { useNavigate } from "react-router-dom";
import * as jwtDecodeModule from "jwt-decode";

export default function StudentDashboardNavbar() {
  const sendToHome = () => {
    console.log("navigating to User's Homepage");
    navigate("/studentDashboard/");
  }

  const sendToYourTutors = () => {
    console.log("navigating to Your Tutors page");
    navigate("/studentDashboard/yourTutors");
  }
  return (
    <div className="dashboard-nav-main">
      <div className="dashboard-buttons-group">
        <div className="dashboard-button" onClick={sendToYourTutors}>
          Your Tutors
        </div>
        <div className="dashboard-button">
          Appointments
        </div>
        <div className="dashboard-button" onClick={sendToHome}>
          Home
        </div>
        <div className="dashboard-button">
          Calendar
        </div>
        <div className="dashboard-button">
          Events
        </div>
      </div>
    </div>
  );
}