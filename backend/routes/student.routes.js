import express from "express";
import db from "../models/index.js"; // Accessing mongoose instance here
import jwt from 'jsonwebtoken'; // Importing jwt module for token verification
const router = express.Router();

// Route to get all students
router.get('/', async (req, res) => {
    try {
        // Find the ObjectId for the 'student' role from the "roles" collection
        const studentRole = await db.mongoose.connection.db.collection("roles").findOne({ name: 'student' });

        if (!studentRole) {
            return res.status(404).json({ message: 'Role "student" not found in roles collection' });
        }

        // Fetch all users from the "users" collection where the 'roles' array contains the 'student' role ObjectId
        const students = await db.mongoose.connection.db.collection("users")
            .find({ roles: studentRole._id })
            .toArray();

        if (!students || students.length === 0) {
            return res.status(404).json({ message: 'No students found' });
        }

        res.json(students);  // Send back the list of students
    } catch (err) {
        console.error("Error fetching students:", err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

export default router;