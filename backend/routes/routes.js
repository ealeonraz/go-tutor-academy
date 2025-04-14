import express from "express";
import connectDB from "../database/db.js"; // Import the database connection function
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { getTutorNotes } from "../controllers/noteController.js";
import { storeTutorNote } from "../models/Note.js";



/**
 * @route   GET /api/users/:email
 * @desc    Retrieve a specific user by email
 * @access  Public
 */
router.get("/api/users/:email", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("users");

    // Find user by email
    const user = await collection.findOne({ email: req.params.email });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /feedback
 * @desc    Save tutor session feedback to the database
 * @access  Public
 */
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

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    const db = await connectDB();
    const collection = db.collection("users");
    let results;
    
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      results = await collection.find({
        role: "tutor",
        $or: [
          { firstName: { $regex: lowerCaseQuery, $options: "i" } },
          { lastName: { $regex: lowerCaseQuery, $options: "i" } }
        ]
      }).toArray();
    } else {
      // No query provided: return all tutors
      results = await collection.find({ role: "tutor" }).toArray();
    }
    
    console.log("Tutors found:", results);
    res.json(results);
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ error: "Search failed" });
  }
});



export default router;