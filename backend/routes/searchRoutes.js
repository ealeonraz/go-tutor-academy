import express from 'express';
import db from '../models/index.js';
import { searchTutors } from '../controllers/searchController.js';

const router = express.Router();

router.get('/', searchTutors); // GET /api/search?q=[searchTerm]

router.get('/subjects', async (req, res) => {
    try {
        const usersCol = db.mongoose.connection.db.collection("users");
        const subjects = await usersCol.distinct("subjects");

        console.log("Subjects found:", subjects); // Debugging line
        res.status(200).json(subjects.sort()); // Sort alphabetically
    } catch (err) {
        console.error("❌ Error fetching subjects:", err);
        res.status(500).json({ message: "Failed to retrieve subjects." });
    }
});

export default router;