import React, { useLayoutEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StudentDashboardHome from './pages/studentDashboard';
import SDH_yourTutors from './pages/SDH-yourTutors';
import "./App.css";
import Layout from './components/Layout';
import SearchTutorResults from './pages/Search-Tutor-Results';
import AccountSettings from './pages/account-settings'; // Import the new AccountSettings component

function App() {
  return (

    <Routes element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/studentDashboard" element={<StudentDashboardHome />} />
      <Route path="/studentDashboard/yourTutors" element={<SDH_yourTutors />} />
      <Route path="/studentDashboard/SearchTutorResults" element={<SearchTutorResults />} />
      <Route path="/account-settings" element={<AccountSettings />} /> {/* Add this line for account settings */}
    </Routes>
  );
}

export default App;
