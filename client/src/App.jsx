import React, { useLayoutEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage/Home.jsx';
import DashboardHome from './pages/Dashboard/Dashboard.jsx';
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
import DashboardCalendar from './pages/Calendar/DashboardCalendar.jsx';
import ManageUsers from './pages/Admin/ManageUsers.jsx';

function App() {
  return (

    <Routes element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route element={<PrivateRoute />}>
        <Route path="/Dashboard" element={<DashboardHome />} />
        <Route path="/tutor-dashboard" element={<TutorDashboardHome />} />
        <Route path="/tutor-dashboard/your-students" element={<TDH_yourStudents />} />
        <Route path="/tutor-dashboard/search-student-results" element={<SearchStudentResults />} />
        <Route path="/tutor-dashboard/notes" element={<NotesPage />} />
        <Route path="/AccountSettings" element={<AccountSettings />} /> {/* Add this line for account settings */}
        <Route path="/Dashboard/calendar" element={<DashboardCalendar />} />
        <Route path="/Dashboard/YourTutors" element={<SDH_yourTutors />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/Admin/ManageUsers" element={<ManageUsers />} />

        <Route path="/admin-dashboard" element={<AdminDashboardHome />} />
        <Route path="/admin-dashboard/your-students" element={<ADH_yourStudents />} />
        <Route path="/admin-dashboard/your-tutors" element={<ADH_yourTutors />} />
        <Route path="/admin-dashboard/search-student-results" element={<AdminSearchStudentResults />} />
        <Route path="/admin-dashboard/search-tutor-results" element={<AdminSearchTutorResults />} />
        <Route path="/admin-dashboard/notes" element={<NotesPage />} />
      </Route>
    </Routes>
  );
}

export default App;
