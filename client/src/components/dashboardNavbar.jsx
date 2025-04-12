import { useNavigate } from "react-router-dom";
import * as jwtDecodeModule from "jwt-decode";

export default function StudentDashboardNavbar() {
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
    navigate("/studentDashboard/");
  }

  const sendToYourTutors = () => {
    console.log("navigating to Your Tutors page");
    navigate("/studentDashboard/yourTutors");
  }
  if (!isLoggedIn) {
    return <div>Error! You are not suppose to see this page.</div>
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

export  function TutorDashboardNavbar() {
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
    navigate("/studentDashboard/");
  }

  const sendToYourTutors = () => {
    console.log("navigating to Your Tutors page");
    navigate("/studentDashboard/yourTutors");
  }
  if (!isLoggedIn) {
    return <div>Error! You are not suppose to see this page.</div>
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