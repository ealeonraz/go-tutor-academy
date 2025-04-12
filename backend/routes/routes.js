import express from "express";
import connectDB from "../database/db.js"; // Import the database connection function
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { getTutorNotes } from "../controllers/noteController.js";
import { storeTutorNote } from "../models/Note.js";
import { authenticateToken } from "../middleware/authMiddleware.js"; // Import the authentication middleware

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @route   GET /About
 * @desc    Retrieve all students from the database
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    // Connect to the database
    const db = await connectDB(); 
    
    // Access the "students" collection (Students table in the database)
    const collection = db.collection("students"); 
    
    // Retrieve all student records and convert them to an array
    const results = await collection.find({}).toArray();
    
    // Send the retrieved student data back to '/About' as a JSON response
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

/**
 * @route   POST /register
 * @desc    Register a new account in the database
 * @access  Public
 */
router.post("/register", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("users");

    const { first, last, email, password, confirmPassword } = req.body;

    // Case 1 - account exists
    const existingStudent = await collection.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        error: "Email already in use",
      });
    }
    
    // Case 2 - new account
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newStudent = {
      firstName: first,
      lastName: last,
      email: email,
      password: hashedPassword,
      role: "student",
      tutor: null,
    }; 
    const result = await collection.insertOne(newStudent);
    res.status(201).json({
      message: "Feedback submit",
      id: result.insertedId,
    });
    // Note: You may want to handle cases for invalid email and password mismatches
  } catch (error) {
    console.error("Failed to create account", error);
    res.status(500).json({ error: "Failed to create account" });
  }
});

/**
 * @route   POST /login
 * @desc    Log into an account and receive a JWT token
 * @access  Public
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = await connectDB();
    const collection = db.collection("users");

    // Find the user
    const user = await collection.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials (email)" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials (password)" });
    }

    // Payload for JWT
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    // Create token
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1h"
    });

    res.status(200).json({ message: "Login successful", token: token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Failed to log into account" });
  }
});

/**
 * @route   GET /reviews
 * @desc    Retrieve all reviews from the database
 * @access  Public
 */
router.get("/reviews", async (req, res) => {
  try {
    const db = await connectDB(); 
    const collection = db.collection("reviews"); 
    const results = await collection.find({}).toArray();
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

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

// Get tutor notes (with filters)
router.get("/tutor-notes", getTutorNotes);

// Store tutor notes
router.post("/tutor-notes", storeTutorNote);

//POSTing appointments
router.post("/appointments", authenticateToken, async (req, res) => {
  const { tutorId, subject, date, startTime, endTime, tutorNotes } = req.body;
  const studentId = req.user.id;

  if (!tutorId || !subject || !date || !startTime || !endTime) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const db = await connectDB();
  const collection = db.collection("appointments");

  const start = new Date(startTime);
  const end = new Date(endTime);

  // Check for overlap for that tutor
  const conflict = await collection.findOne({
    tutorId: new ObjectId(tutorId),
    startTime: { $lt: end },
    endTime: { $gt: start },
  });

  if (conflict) {
    return res.status(409).json({ error: "Time slot already booked" });
  }

  const appointment = {
    studentId: new ObjectId(studentId),
    tutorId: new ObjectId(tutorId),
    subject,
    date: new Date(date),
    startTime: start,
    endTime: end,
    status: "pending",
    confirmationCode: generateConfirmationCode(),
    tutorNotes: tutorNotes || "",
  };

  await collection.insertOne(appointment);
  res.status(201).json({ message: "Appointment created" });
});

function generateConfirmationCode() {
  return Math.random().toString(36).substring(2, 7).toUpperCase(); // e.g. "GNCHX"
}

// Get all appointments for a specific student
router.get("/appointments", authenticateToken, async (req, res) => {
  const db = await connectDB();
  const collection = db.collection("appointments");

  const userId = new ObjectId(req.user.id);
  const role = req.user.role;

  let filter = {};
  if (role === "student") {
    filter.studentId = userId;
  } else if (role === "tutor") {
    filter.tutorId = userId;
  } else {
    return res.status(403).json({ error: "Unauthorized role" });
  }

  const appointments = await collection.find(filter).sort({ date: 1 }).toArray();
  res.json(appointments);
});


export default router;