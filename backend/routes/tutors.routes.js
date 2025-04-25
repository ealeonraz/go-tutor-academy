import express from "express";
import db from "../models/index.js"; // Accessing mongoose instance here
import jwt from 'jsonwebtoken'; // Importing jwt module for token verification

const router = express.Router();

// Route to get all tutors from the "tutors" collection
router.get('/', async (req, res) => {
    try {
        // Fetch all tutors from the "tutors" collection
        const tutors = await db.mongoose.connection.db.collection("tutors").find({}).toArray();

        if (!tutors || tutors.length === 0) {
            return res.status(404).json({ message: 'No tutors found' });
        }

        // Send back the list of tutors
        res.json(tutors);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

export default router;
