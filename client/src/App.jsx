import React, { useLayoutEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/homepage/home.jsx';
import TutorHours from './pages/TutorHours';
import AdminPayOverview from './pages/AdminPayOverview';
import StudentDashboardHome from './pages/dashboard/Dashboard.jsx';
import TutorDashboardHome from './pages/TutorDashboard';
import "./App.css";
import Layout from './components/Layout';
import NotesPage from './pages/NotesPage/NotesPage.jsx';
import SearchResults from './pages/SearchResults/SearchResults.jsx';
import SearchStudentResults from './pages/SearchResults/Search-Student-Results';
import AdminSearchTutorResults from './pages/Admin-Search-Tutor-Results';
import AdminSearchStudentResults from './pages/SearchResults/Search-Student-Results';
import AccountSettings from './pages/AccountSettings/AccountSettings.jsx'; // Import the new AccountSettings component
import PrivateRoute from "./context/PrivateRoutes.jsx"
import StudentDashboardCalendar from './pages/calendar/DashboardCalendar.jsx';
import AdminDashboardHome from './pages/AdminDashboard.jsx';
import TutorProfileView from './pages/TutorProfileView.jsx';
import ResetPassword from './pages/ResetPassword.jsx';



function App() {
  return (

    <Routes element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route element = {<PrivateRoute/>}>
        <Route path="/student-dashboard" element={<StudentDashboardHome />} />
        <Route path="/student-dashboard/calendar" element={<StudentDashboardCalendar/>}/>
        <Route path="/studentdashboard/search-results" element={<SearchResults />} />
        <Route path="/admin-dashboard" element={<AdminDashboardHome/>}/>
        <Route path="/admin-dashboard/tutors" element={<TutorProfileView />} />
        <Route path="/student-dashboard/notes" element={<NotesPage/>}/>
        <Route path="/TutorHours" element={<TutorHours />} />
        <Route path="/admin-dashboard/admin-payroll" element={<AdminPayOverview />} />
        <Route path="/tutor-dashboard" element={<TutorDashboardHome />} />
      </Route>
      <Route path="/reset-password" element={<ResetPassword/>}/>
    </Routes>
  );
}

export default App;
