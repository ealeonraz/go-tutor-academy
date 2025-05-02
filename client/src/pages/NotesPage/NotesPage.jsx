// src/pages/NotesPage.jsx

import React, { useState, useEffect } from "react"
import "./NotesPage.css"
import "../HomePage/Home.css"
import "../../components/Component.css"
import Navbar from "../../components/Navbars/LoggedInNavbar"
import DashboardNavbar from "../../components/Navbars/DashboardNavbar"
import Footer from "../../components/Footer"
import "../Page.css"

const NotesPage = () => {
  const [notes, setNotes] = useState([])
  const [search, setSearch] = useState("")
  const [date, setDate] = useState("")
  const [subject, setSubject] = useState("")
  const [studentName, setStudentName] = useState("")

  const subjects = [
    "Math",
    "Science",
    "English",
    "Social Studies",
    "Computer Science",
    "Test Prep",
    "History",
    "Art",
    "Music",
    "Foreign Languages",
    "Chemistry",
    "Biology",
    "Economics",
    "Philosophy",
  ]

  const fetchNotes = async () => {
    try {
      const params = new URLSearchParams()
      if (search)      params.append("search", search)
      if (date)        params.append("date", date)
      if (subject)     params.append("subject", subject)
      if (studentName) params.append("studentName", studentName)

      const response = await fetch(
        `http://localhost:4000/api/tutor-notes?${params.toString()}`
      )
      if (!response.ok) throw new Error(response.statusText)

      const data = await response.json()
      setNotes(data)
    } catch (error) {
      console.error("Error fetching notes", error)
    }
  }

  // load all notes on first render
  useEffect(() => {
    fetchNotes()
  }, [])

  return (
    <>
      <Navbar />
      <DashboardNavbar />

      <div className="notes-page">
        <h1>View Notes Left on Students</h1>

        <div className="filters-wrapper">
          {/* Student name filter */}
          <input
            type="text"
            placeholder="Search by student name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="search-icon"
          />

          {/* Notes text search */}
          <input
            type="text"
            placeholder="Search notes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-icon"
          />

          {/* Date picker */}
          <input
            type={date ? "date" : "text"}
            placeholder="Pick Appointment Date"
            value={date}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => !date && (e.target.type = "text")}
            onChange={(e) => setDate(e.target.value)}
          />

          {/* Subject dropdown */}
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">Select a Subject</option>
            {subjects.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>

          {/* explicit search button */}
          <button type="button" onClick={fetchNotes}>
            Search
          </button>
        </div>

        {/* Notes list */}
        {notes.length === 0 ? (
          <p>No notes found</p>
        ) : (
          <ul className="notes-list">
            {notes.map((note) => (
              <li key={note._id.toString()}>
                <div className="note-entry">
                  <div>
                    <strong>Student:</strong> {note.studentName}
                  </div>
                  <div>
                    <strong>Subject:</strong> {note.subject}
                  </div>
                  <div>
                    <strong>Date:</strong>{" "}
                    {new Date(note.date).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Tutor Notes:</strong> {note.tutorNotes}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Footer />
    </>
  )
}

export default NotesPage
