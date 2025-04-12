import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AppointmentForm from './pages/AppointmentForm';
import AptFeedback from './pages/AptFeedback';
import TutorFeedback from './pages/TutorFeedback';
import TutorHours from './pages/TutorHours';
import AdminPayOverview from './pages/AdminPayOverview';


import "./App.css";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AppointmentForm" element={<AppointmentForm />} />
        <Route path="/AptFeedback" element={<AptFeedback />} /> 
        <Route path="/tutor-feedback" element={<TutorFeedback />} />
        <Route path="/TutorHours" element={<TutorHours />} />
        <Route path="/AdminPayOverview" element={<AdminPayOverview />} />
      </Routes>
    </Router>
  );
}

export default App;
