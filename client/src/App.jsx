import React, { useLayoutEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StudentDashboardHome from './pages/studentDashboard';
import TutorDashboardHome from './pages/TutorDashboard';
import AdminDashboardHome from './pages/AdminDashboard';
import SDH_yourTutors from './pages/SDH-yourTutors';
import TDH_yourStudents from './pages/TDH-yourStudents';
import ADH_yourStudents from './pages/ADH-yourStudents';
import ADH_yourTutors from './pages/ADH-yourTutors';
import "./App.css";
import Layout from './components/Layout';
import NotesPage from './pages/NotesPage';
import SearchTutorResults from './pages/Search-Tutor-Results';
import SearchStudentResults from './pages/Search-Student-Results';
import AdminSearchTutorResults from './pages/Admin-Search-Tutor-Results';
import AdminSearchStudentResults from './pages/Search-Student-Results';

function App() {
  return (

    <Routes element={<Layout />}>
      <Route path="/" element={<Home />} />

      <Route path="/student-dashboard" element={<StudentDashboardHome />} />
      <Route path="/student-dashboard/your-tutors" element={<SDH_yourTutors />} />
      <Route path="/student-dashboard/search-tutor-results" element={<SearchTutorResults />} />

      <Route path="/tutor-dashboard" element={<TutorDashboardHome />} />
      <Route path="/tutor-dashboard/your-students" element={<TDH_yourStudents />} />
      <Route path="/tutor-dashboard/search-student-results" element={<SearchStudentResults />} />
      <Route path="/tutor-dashboard/notes" element={<NotesPage />} />

      <Route path="/admin-dashboard" element={<AdminDashboardHome />} />
      <Route path="/admin-dashboard/your-students" element={<ADH_yourStudents />} />
      <Route path="/admin-dashboard/your-tutors" element={<ADH_yourTutors />} />
      <Route path="/admin-dashboard/search-student-results" element={<AdminSearchStudentResults />} />
      <Route path="/admin-dashboard/search-tutor-results" element={<AdminSearchTutorResults />} />
      <Route path="/admin-dashboard/notes" element={<NotesPage />} />
    </Routes>
  );
}

export default App;
