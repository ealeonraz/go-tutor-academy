import express from "express";
import { ObjectId } from "mongodb";
import db from "../models/index.js";

const router = express.Router();

// GET  /api/tutor-notes
router.get("/", async (req, res) => {
  try {
    const { search, subject, date, studentName } = req.query
    const notesCol  = db.mongoose.connection.db.collection("notes")
    const usersCol  = db.mongoose.connection.db.collection("users")
    const rolesCol  = db.mongoose.connection.db.collection("roles")

    // 1) find the student‐role ObjectId once
    const studentRoleDoc = await rolesCol.findOne({ name: "student" })
    if (!studentRoleDoc) {
      return res.status(500).json({ message: "Student role not found" })
    }
    const studentRoleId = studentRoleDoc._id

    // 2) build the notes query
    const query = { note: { $ne: "" } }
    if (search)    query.note    = { $regex: search, $options: "i" }
    if (subject)   query.subject = subject
    if (date) {
      query.date = {
        $gte: new Date(`${date}T00:00:00.000Z`),
        $lte: new Date(`${date}T23:59:59.999Z`)
      }
    }

    // 3) if filtering by studentName, match users with that role ObjectId
    if (studentName) {
      const nameRegex = new RegExp(studentName, "i")
      const matches = await usersCol
        .find({
          role: studentRoleId,
          $or: [
            { firstName: { $regex: nameRegex } },
            { lastName:  { $regex: nameRegex } }
          ]
        })
        .project({ _id: 1 })
        .toArray()

      const ids = matches.map(u => u._id)
      if (!ids.length) return res.json([])
      query.studentId = { $in: ids }
    }

    // 4) fetch notes and join student names
    const docs = await notesCol.find(query).toArray()
    const studentIds = [...new Set(docs.map(n => n.studentId))]
    const students = await usersCol
      .find({ _id: { $in: studentIds } })
      .project({ firstName: 1, lastName: 1 })
      .toArray()

    const nameMap = students.reduce((m, s) => {
      m[s._id.toHexString()] = `${s.firstName} ${s.lastName}`
      return m
    }, {})

    // 5) shape response
    const notes = docs.map(n => ({
      _id:         n._id,
      subject:     n.subject,
      date:        n.date,
      tutorNotes:  n.note,
      studentId:   n.studentId,
      studentName: nameMap[n.studentId.toHexString()] || "Unknown Student",
      tutorId:     n.tutorId
    }))

    res.json(notes)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Error fetching tutor notes", error: err.message })
  }
})

// POST /api/tutor-notes
router.post("/", async (req, res) => {
  try {
    const { tutorId, studentId, subject, note, date, studentName } = req.body;
    if (!tutorId || !studentId || !subject || !note || !date) {
      return res
        .status(400)
        .json({ message: "All fields (tutorId, studentId, subject, note, date) are required" });
    }

    const notesCol = db.mongoose.connection.db.collection("notes");
    const doc = {
      tutorId:    new ObjectId(tutorId),
      studentId:  new ObjectId(studentId),
      subject,
      note,
      date:       new Date(date),
      studentName,
    };

    const result = await notesCol.insertOne(doc);
    if (result.insertedId) {
      res.status(201).json({ message: "Note stored successfully", id: result.insertedId });
    } else {
      res.status(400).json({ message: "Failed to store the note." });
    }
  } catch (err) {
    console.error("Error storing tutor note:", err);
    res.status(500).json({ message: "Error storing tutor note", error: err.message });
  }
});

export default router;
