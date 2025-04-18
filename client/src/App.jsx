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
import PrivateRoute from "./context/PrivateRoutes.jsx"

function App() {
  return (

    <Routes element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route element = {<PrivateRoute/>}>
        <Route path="/studentdashboard" element={<StudentDashboardHome />} />
      </Route>
      <Route path="/studentdashboard/yourutors" element={<SDH_yourTutors />} />
      <Route path="/studentdashboard/search-results" element={<SearchTutorResults />} />
    </Routes>
  );
}

export default App;
