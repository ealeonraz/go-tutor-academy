import React, { useLayoutEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StudentDashboardHome from './pages/studentDashboard';
import TutorDashboardHome from './pages/TutorDashboard';
import SDH_yourTutors from './pages/SDH-yourTutors';
import TDH_yourStudents from './pages/TDH-yourStudents';
import "./App.css";
import Layout from './components/Layout';
import NotesPage from './pages/NotesPage';
import SearchTutorResults from './pages/Search-Tutor-Results';
import SearchStudentResults from './pages/Search-Student-Results';
import AccountSettings from './pages/account-settings'; // Import the new AccountSettings component

function App() {
  return (

    <Routes element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route element={<PrivateRoute />}>
        <Route path="/studentdashboard" element={<StudentDashboardHome />} />
        <Route path="/student-dashboard" element={<StudentDashboardHome />} />
        <Route path="/student-dashboard/your-tutors" element={<SDH_yourTutors />} />
        <Route path="/student-dashboard/search-tutor-results" element={<SearchTutorResults />} />
        <Route path="/tutor-dashboard" element={<TutorDashboardHome />} />
        <Route path="/tutor-dashboard/your-students" element={<TDH_yourStudents />} />
        <Route path="/tutor-dashboard/search-student-results" element={<SearchStudentResults />} />
        <Route path="/tutor-dashboard/notes" element={<NotesPage />} />
        <Route path="/account-settings" element={<AccountSettings />} /> {/* Add this line for account settings */}
      </Route>
    </Routes>
  );
}

export default App;
