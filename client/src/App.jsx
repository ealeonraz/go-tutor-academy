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

function App() {
  return (

    <Routes element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/studentDashboard" element={<StudentDashboardHome />} />
      <Route path="/studentDashboard/yourTutors" element={<SDH_yourTutors />} />
      <Route path="/notes" element={<NotesPage />} />
      <Route path="/studentDashboard/SearchTutorResults" element={<SearchTutorResults />} />
      <Route path="/tutorDashboard" element={<TutorDashboardHome />} />
      <Route path="/tutorDashboard/yourStudents" element={<TDH_yourStudents />} />
      <Route path="/tutorDashboard/SearchStudentResults" element={<SearchStudentResults />} />
    </Routes>
  );
}

export default App;
