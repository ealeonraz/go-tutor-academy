import React, { useLayoutEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AppointmentForm from './pages/AppointmentForm';
import AptFeedback from './pages/AptFeedback';
import TutorFeedback from './pages/TutorFeedback';
import TutorHours from './pages/TutorHours';
import AdminPayOverview from './pages/AdminPayOverview';import StudentDashboardHome from './pages/studentDashboard';
import TutorDashboardHome from './pages/TutorDashboard';
import SDH_yourTutors from './pages/SDH-yourTutors';
import TDH_yourStudents from './pages/TDH-yourStudents';
import "./App.css";
import Layout from './components/Layout';
import NotesPage from './pages/NotesPage';
import SearchTutorResults from './pages/Search-Tutor-Results';
import SearchStudentResults from './pages/Search-Student-Results';
import PrivateRoute from "./context/PrivateRoutes.jsx"
import StudentDashboardCalendar from './pages/StudentDashboardCalendar.jsx';
import AdminPayrollPage from './pages/AdminPayroll.jsx';
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
        <Route path="/studentdashboard/yourutors" element={<SDH_yourTutors />} />
        <Route path="/studentdashboard/search-results" element={<SearchTutorResults />} />
        <Route path="/admin/payroll" element={<AdminPayrollPage/>}/>
        <Route path="/admin-dashboard" element={<AdminDashboardHome/>}/>
        <Route path="/admin-dashboard/tutors" element={<TutorProfileView />} />
        <Route path="/student-dashboard/notes" element={<NotesPage/>}/>
        <Route path="/TutorHours" element={<TutorHours />} />
        <Route path="/AdminPayOverview" element={<AdminPayOverview />} />
    
      </Route>
      <Route path="/reset-password" element={<ResetPassword/>}/>
    </Routes>
  );
}

export default App;
