import React, { useLayoutEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage/Home.jsx';
import DashboardHome from './pages/Dashboard/Dashboard.jsx';
import TutorDashboardHome from './pages/TutorDashboard';
import SDH_yourTutors from './pages/YourTutors/YourTutors.jsx';
import TDH_yourStudents from './pages/TDH-yourStudents';
import "./App.css";
import Layout from './components/Layout';
import NotesPage from './pages/NotesPage/NotesPage.jsx';
import SearchTutorResults from './pages/SearchResults/Search-Tutor-Results';
import SearchStudentResults from './pages/SearchResults/Search-Student-Results';
import AccountSettings from './pages/AccountSettings/AccountSettings.jsx'; // Import the new AccountSettings component
import PrivateRoute from "./context/PrivateRoutes.jsx"
import DashboardCalendar from './pages/Calendar/DashboardCalendar.jsx';

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
        <Route path="/Dashboard/calendar" element={<DashboardCalendar/>}/>
        <Route path="/Dashboard/YourTutors" element={<SDH_yourTutors />} />
        <Route path="/Dashboard/search-results" element={<SearchTutorResults />} />
      </Route>
    </Routes>
  );
}

export default App;
