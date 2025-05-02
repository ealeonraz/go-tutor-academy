import React, { useLayoutEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AppointmentForm from './pages/AppointmentForm';
import AptFeedback from './pages/AptFeedback';
import TutorFeedback from './pages/TutorFeedback';
import TutorHours from './pages/TutorHours';
import AdminPayOverview from './pages/AdminPayOverview';
import StudentDashboardHome from './pages/studentDashboard';
import TutorDashboardHome from './pages/TutorDashboard';
import AdminDashboardHome from './pages/AdminDashboard';
import SDH_yourTutors from './pages/YourTutors/YourTutors.jsx';
import TDH_yourStudents from './pages/TDH-yourStudents';
import ADH_yourStudents from './pages/ADH-yourStudents';
import ADH_yourTutors from './pages/ADH-yourTutors';
import "./App.css";
import Layout from './components/Layout';
import NotesPage from './pages/NotesPage/NotesPage.jsx';
import SearchResults from './pages/SearchResults/SearchResults.jsx';
import SearchStudentResults from './pages/SearchResults/Search-Student-Results';
import AdminSearchTutorResults from './pages/Admin-Search-Tutor-Results';
import AdminSearchStudentResults from './pages/SearchResults/Search-Student-Results';
import AccountSettings from './pages/AccountSettings/AccountSettings.jsx'; // Import the new AccountSettings component
import PrivateRoute from "./context/PrivateRoutes.jsx"
import StudentDashboardCalendar from './pages/StudentDashboardCalendar.jsx';
import AdminPayrollPage from './pages/AdminPayroll.jsx';
import AdminDashboardHome from './pages/AdminDashboard.jsx';
import TutorProfileView from './pages/TutorProfileView.jsx';


function App() {
  return (

    <Routes element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route element = {<PrivateRoute/>}>
        <Route path="/student-dashboard" element={<StudentDashboardHome />} />
        <Route path="/student-dashboard/calendar" element={<StudentDashboardCalendar/>}/>
        <Route path="/studentdashboard/yourutors" element={<SDH_yourTutors />} />
        <Route path="/studentdashboard/search-results" element={<SearchTutorResults />} />
        <Route path="/admin-dashboard" element={<AdminDashboardHome/>}/>
        <Route path="/admin-dashboard/tutors" element={<TutorProfileView />} />
      </Route>
    </Routes>
  );
}

export default App;
