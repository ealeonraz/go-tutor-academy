import express from "express";
import connectDB from "../database/db.js"; // Import the database connection function
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

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
        
        // Access the "students" collection(Students table in the database)
        const collection = db.collection("students"); 
        
        // Retrieve all student records and convert them to an array
        const results = await collection.find({}).toArray();
        
        // Send the retrieved student data back to '/About' as a JSON response
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching students:", error);
        
        // Send a 500 Internal Server Error response if something goes wrong
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

    const{first, last, email, password, confirmPassword} = req.body;

    // Case 1 - account exists
    const existingStudent = await collection.findOne({email});
    if(existingStudent) {
      res.status(400).json({
        error: "Email already in use",
      })
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
    } 
    const result = await collection.insertOne(newStudent);
    res.status(201).json({
      message: "Feedback submit",
      id: result.insertedId,
    });
    // Case 3 - invalid email
    // Case 4 - passwords don't match

    
  }
  catch (error) {
    console.error("Failed to create account");
    res.status(500).json({ error: "Failed to create account"});
  }
});

router.post("/login", async (req, res) => {
  try {

    const{email, password} = req.body;

    // connect to db
    const db = await connectDB();
    const collection = db.collection("users");

    // find the user
    const user = await collection.findOne({email});
    if (!user) {
      return res.status(401).json({ error: "Invaild credentials (email)"});
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invaild credentials (password)"});
    }

    // payload
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    }

    // create token
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1h"
    });

    // send status
    res.status(200).json({ message: "Login successful", token: token});

  } catch(error) {
    res.status(500).json({ error: "Failed to log into account"});
  }

});


router.get('/api/users/:email', async (req, res) => {
  try {
    // Connect to the database
    const db = await connectDB();
    const collection = db.collection("users");

    // Find user by email
    const user = await collection.findOne({ email: req.params.email });

    if (user) {
      res.json(user);  // Send the user data, including avatar URL
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/api/tutors', async (req, res) => {
  try{
    const tutors = await Tutor.find({ role: "tutor"});
    res.json(tutors);
  }catch (error){
    console.error("Error fetching tutors: ",error);
    res.status(500).json({ error: "Internal Server Error"});
  }
});


export default router;