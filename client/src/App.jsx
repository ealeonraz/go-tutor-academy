import React, { useLayoutEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StudentDashboardHome from './pages/studentDashboard';
import SDH_yourTutors from './pages/SDH-yourTutors';
import "./App.css";
import Layout from './components/Layout';
import SearchTutorResults from './pages/Search-Tutor-Results';

function App() {
  return (

    <Routes element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/studentDashboard" element={<StudentDashboardHome />} />
      <Route path="/studentDashboard/yourTutors" element={<SDH_yourTutors />} />
      <Route path="/studentDashboard/SearchTutorResults" element={<SearchTutorResults />} />
    </Routes>
  );
}

export default App;
