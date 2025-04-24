import { useNavigate } from "react-router-dom";
import * as jwtDecodeModule from "jwt-decode";

function StudentDashboardNavbar() {
  const navigate = useNavigate();

  const sendToHome = () => {
    console.log("navigating to User's Homepage");
    navigate("/Dashboard/");
  }

  const sendToYourTutors = () => {
    console.log("navigating to Your Tutors page");
    navigate("/Dashboard/YourTutors");
  }

  const sendToCalendar = () => {
    navigate("/Dashboard/calendar");
  }

  return (
    <div className="dashboard-nav-main">
      <div className="dashboard-buttons-group">
        <div className="dashboard-button" onClick={sendToYourTutors}>
          Your Tutors
        </div>
        <div className="dashboard-button" onClick={sendToHome}>
          Home
        </div>
        <div className="dashboard-button" onClick={sendToCalendar}>
          Calendar
        </div>
      </div>
    </div>
  );
}

function TutorDashboardNavbar() {
  const useAuth = () => {
    const token = localStorage.getItem('token');
    let user = null;

    if (token) {
      try {
        user = jwtDecodeModule.default(token);

      } catch (error) {
        localStorage.removeItem('token');
        user = null;
      }
    }
    return {
      isLoggedIn: !user,
      user,
    };
  };
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const sendToHome = () => {
    console.log("navigating to User's Homepage");
    navigate("/Dashboard");
  }

  const sendToYourTutors = () => {
    console.log("navigating to Your Tutors page");
    navigate("/Dashboard/yourTutors");
  }
  return (
    <div className="dashboard-nav-main">
      <div className="dashboard-buttons-group">
        <div className="dashboard-button" onClick={sendToYourTutors}>
          My Students
        </div>
        <div className="dashboard-button">
          View Appointments
        </div>
        <div className="dashboard-button" onClick={sendToHome}>
          Home
        </div>
        <div className="dashboard-button">
           My Calendar
        </div>
        <div className="dashboard-button">
          Time Sheet
        </div>
      </div>
    </div>
  );
}

export default StudentDashboardNavbar;