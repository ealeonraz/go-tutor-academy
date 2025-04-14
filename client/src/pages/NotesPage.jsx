import React, { useState, useEffect } from "react";
import './NotesPage.css';
import './Home.css';
import '../components/Component.css';
import Navbar from '../components/LoggedInNavbar';
import TutorDashboardNavbar from "../components/TutorDashboardNavbar";
import Footer from "../components/Footer";

import './Page.css';  

const NotesPage = () => {
    const [notes, setNotes] = useState([]);
    const [search, setSearch] = useState("");
    const [date, setDate] = useState("");
    const [subject, setSubject] = useState("");
    const [studentName, setStudentName] = useState("");
   
  
    const subjects = [
      "Math", "Science", "English", "Social Studies",
      "Computer Science", "Test Prep", "History", "Art", "Music",
      "Foreign Languages", "Chemistry", "Biology", "Economics", "Philosophy"
    ];
  
    const fetchNotes = async () => {
      try {
        const response = await fetch(`http://localhost:4000/tutor-notes?search=${search}&date=${date}&subject=${subject}&studentName=${studentName}`);
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes", error);
      }
    };
  
    useEffect(() => {
      fetchNotes();
    }, [search, date, subject, studentName]);
  
    return (
      <>
      <Navbar />
      <TutorDashboardNavbar /> 
        <div className="notes-page">
          <h1>View Notes Left on Students</h1>
      
          <div className="filters-wrapper">
            {/* Name Search */}
            <input
              type="text"
              placeholder="Search by student name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className = "search-icon"
            />
      
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search notes"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className = "search-icon"
            />
      
            {/* Date Picker Input */}
            <input
              type={date ? "date" : "text"}
              placeholder="Pick Appointment Date"
              value={date}
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => !date && (e.target.type = 'text')}
              onChange={(e) => setDate(e.target.value)}
            />
      
            {/* Subject Filter */}
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">Select a Subject</option>
              {subjects.map((subjectName) => (
                <option key={subjectName} value={subjectName}>
                  {subjectName}
                </option>
              ))}
            </select>
          </div>
      
          {/* Displaying Notes */}
          {notes.length === 0 ? (
            <p>No notes found</p>
          ) : (
            <ul className="notes-list">
              {notes.map((note) => (
               <li key={note._id}>
               <div className="note-entry">
                 <div><strong>Student:</strong> {note.studentName}</div>
                 <div><strong>Subject:</strong> {note.subject}</div>
                 <div><strong>Date:</strong> {new Date(note.date).toLocaleDateString()}</div>
                 <div><strong>Tutor Notes:</strong> {note.tutorNotes}</div>
               </div>
             </li>
           ))}
         </ul>
         
          )}
          {/* Footer */}
        
        </div>
        <Footer />
        </>
      );
};

export default NotesPage;