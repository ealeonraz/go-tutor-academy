import express from "express";
import db from "../models/index.js";
import Action from "../models/action.model.js";
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const feedbackData = req.body;

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    const userId = decoded.id;

    // Store the inserted feedback object in `result`
    const result = await db.mongoose.connection.db
      .collection("feedback")
      .insertOne(feedbackData);

    // Create the action log for the "feedback_left" action
    await Action.create({
      action_type: 'feedback_left',
      user_id: userId,  // The user who triggered the action (using decoded userId)
      related_entity_id: result.insertedId,  // Relate to the feedback by using its ObjectId
      metadata: {
        feedback_id: result.insertedId,  // Including the feedback ID in metadata, if needed
      }
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      id: result.insertedId,  // Send back the newly inserted feedback ID
    });
  } catch (err) {
    console.error("Unable to create new feedback", err);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

export default router;
