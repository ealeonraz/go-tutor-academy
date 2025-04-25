import express from "express";
import db from "../models/index.js"; // Accessing mongoose instance here
import jwt from 'jsonwebtoken'; // Importing jwt module for token verification
const router = express.Router();

// Route to get user by email (based on the decoded JWT)
router.get('/:id', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userEmail = decoded.email;

        // Query the database using the email (not userID)
        const user = await db.mongoose.connection.db.collection("users").findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If user found, send the user data as a response
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});


export default router;
