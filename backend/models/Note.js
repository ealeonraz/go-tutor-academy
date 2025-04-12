// DT 102 Note Storage 

// Store tutor notes in the notes collection
export const storeTutorNote = async (req, res) => {
    try {
      const { tutorId, studentId, subject, note, date, studentName } = req.body;
  
      // Validate required input fields
      if (!tutorId || !studentId || !subject || !note || !date) {
        return res.status(400).json({ message: "All fields (tutorId, studentId, subject, note, and date) are required" });
      }
  
      const db = await connectDB();
      const notesCollection = db.collection("notes");
  
      // Insert the tutor note into the notes collection
      const result = await notesCollection.insertOne({
        tutorId: ObjectId(tutorId),
        studentId: ObjectId(studentId),
        subject: subject,
        note: note,
        date: new Date(date),
        studentName: studentName, // Add student name to the note
      });
  
      // Respond based on insertion result
      if (result.insertedCount > 0) {
        return res.status(201).json({ message: "Note stored successfully" });
      } else {
        return res.status(400).json({ message: "Failed to store the note." });
      }
    } catch (error) {
      console.error("Error storing tutor note:", error);
      res.status(500).json({ message: "Error storing tutor note", error: error.message });
    }
  };