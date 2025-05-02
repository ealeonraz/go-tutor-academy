import express from "express";
import db from "../models/index.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const feedbackData = req.body;

    // store the insertOne return value in `result`
    const result = await db.mongoose.connection.db
      .collection("feedback")
      .insertOne(feedbackData);

    res.status(201).json({
      message: "Feedback submitted successfully",
      id: result.insertedId,          // now this exists
    });
  } catch (err) {
    console.error("Unable to create new feedback", err);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

export default router;
