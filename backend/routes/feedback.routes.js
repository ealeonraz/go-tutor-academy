import express from "express";
import { connectDB } from "../database/db.js"; // Your database connection
const router = express.Router();

// Route to handle feedback submission
router.post("/feedback", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("feedback");
    const feedbackData = req.body;
    const result = await collection.insertOne(feedbackData);
    res.status(201).json({
      message: "Feedback submitted successfully",
      id: result.insertedId,
    });
  } catch (err) {
    console.error("Unable to create new feedback", err);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

export default router;
