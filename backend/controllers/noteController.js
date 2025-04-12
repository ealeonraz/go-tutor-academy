import { ObjectId } from "mongodb";
import connectDB from "../database/db.js";

//DT 101 Note Retrieval 
// Get notes on students
export const getTutorNotes = async (req, res) => {
  try {
    const { search, subject, date, studentName } = req.query;

    const db = await connectDB();
    const appointmentsCollection = db.collection("appointments");
    const usersCollection = db.collection("users");

    // Base query to fetch only appointments that have tutor notes
    let query = {
      tutorNotes: { $ne: "" },
    };

    // Optional filters
    if (search) {
      query.tutorNotes = { $regex: search, $options: "i" };
    }

    if (subject) {
      query.subject = subject;
    }

    if (date) {
      // Filter by exact date (from start to end of day)
      const startOfDay = new Date(date + "T00:00:00.000Z");
      const endOfDay = new Date(date + "T23:59:59.999Z");
      query.date = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    // Filter by student name (first or last)
    let studentIdFilter = null;
    if (studentName) {
      const nameRegex = new RegExp(studentName, "i");

      const matchingStudents = await usersCollection
        .find({
          role: "student",
          $or: [
            { firstName: { $regex: nameRegex } },
            { lastName: { $regex: nameRegex } },
          ],
        })
        .project({ _id: 1 })
        .toArray();

      studentIdFilter = matchingStudents.map((student) => student._id);

      // Return early if no matching students are found
      if (studentIdFilter.length === 0) {
        return res.status(200).json([]);
      }

      query.studentId = { $in: studentIdFilter };
    }

    // Retrieve appointments that match the filters
    let appointments = await appointmentsCollection.find(query).toArray();

    // Extract unique student IDs for name lookup
    const studentIds = [
      ...new Set(
        appointments
          .map(app => {
            try {
              return new ObjectId(app.studentId);
            } catch (err) {
              console.error("Error casting studentId:", err);
              return null;
            }
          })
          .filter(id => id !== null)
      ),
    ];

    // Get student names for the IDs
    const students = await usersCollection
      .find({ _id: { $in: studentIds } })
      .project({ _id: 1, firstName: 1, lastName: 1 })
      .toArray();

    // Build map of studentId to full name
    const studentMap = {};
    students.forEach(student => {
      studentMap[student._id.toHexString()] = `${student.firstName} ${student.lastName}`;
    });

    // Attach student names to notes response
    const notes = appointments.map((appointment) => ({
      subject: appointment.subject,
      date: appointment.date,
      tutorNotes: appointment.tutorNotes,
      studentId: appointment.studentId,
      studentName: studentMap[appointment.studentId.toHexString()] || "Unknown Student",
      tutorId: appointment.tutorId,
    }));

    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching tutor notes:", error);
    res.status(500).json({ message: "Error fetching tutor notes", error: error.message });
  }
};