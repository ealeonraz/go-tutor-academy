import { useNavigate } from "react-router-dom";
import * as jwtDecodeModule from "jwt-decode";

export default function TutorDashboardNavbar() {
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
      navigate("/tutorDashboard/");
    }
  
    const sendToYourStudents = () => {
      console.log("navigating to Your Students page");
      navigate("/tutorDashboard/yourStudents");
    }
    if (!isLoggedIn) {
      return <div>Error! You are not supposed to see this page.</div>
    }
    return (
      <div className="dashboard-nav-main">
        <div className="dashboard-buttons-group">
          <div className="dashboard-button" onClick={sendToYourStudents}>
            Your Students
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