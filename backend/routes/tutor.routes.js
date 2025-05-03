import express from 'express'; // Import Express for routing
import jwt from 'jsonwebtoken'; // JSON Web Token for authentication
import Tutor from '../models/tutor.model.js'; // Tutor model for database interaction
import db from '../models/index.js'; 
import config from '../config/auth.config.js';
import Appointment from '../models/appointment.model.js'; // Importing Appointment model
import authJwt from '../middlewares/authJwt.js'; // Middleware for JWT authentication
import { updateTutorSubjects } from "../controllers/tutor.controller.js";

const router = express.Router();

router.get('/:id/info', async (req, res) => {
  try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
          return res.status(401).json({ message: 'No token provided' });
      }

      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userEmail = decoded.email;

      // Query the database using the email and populate the roles field to include both name and ObjectId
      const user = await db.mongoose.connection.db.collection("users").aggregate([
          { $match: { email: userEmail } }, // Match the user by email
          {
              $lookup: {
                  from: "roles",  // The name of the roles collection
                  localField: "roles",  // The field in the users collection that stores ObjectId references to the roles collection
                  foreignField: "_id",  // The field in the roles collection that stores the ObjectId
                  as: "roleDetails"  // Name of the field in the resulting object
              }
          },
          { 
              $unwind: { 
                  path: "$roleDetails",  // Unwind the array to get a single role for each user
                  preserveNullAndEmptyArrays: true  // In case the user has no roles
              }
          },
          {
              $project: {
                  email: 1,  // Include email
                  firstName: 1,  // Include firstName
                  lastName: 1,  // Include lastName
                  roles: 1,  // Include role(s) ObjectId
                  roleName: "$roleDetails.name",  // Include the name of the role
                  roleId: "$roleDetails._id",  // Include the ObjectId of the role
                  bio: 1,  // Include bio
                  availableHours: 1,  // Include availableHours
                  students: 1,  // Include students field
                  payRate: 1,  // Include payRate
                  profileLink: 1  // Include profileLink
              }
          }
      ]).toArray();

      if (user.length === 0) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Send back the user data with both the role name and role ObjectId
      res.json(user[0]);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});


/**
 * @route   GET /api/tutors
 * @desc    Retrieve all tutors from the database (admin access)
 * @access  Protected (requires JWT token)
 */

router.delete('/:id', async (req, res) => {
  const appointmentId = req.params.id;

  try {
    // Find and delete the appointment by ID
    const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);

    if (!deletedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Send response back that appointment has been deleted
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    console.error('Error deleting appointment:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    // Verify the token and decode the payload
    const decoded = jwt.verify(token, config.secret);

    // Optional: add role-based authorization here if needed (e.g., only allow admins)

    // Query the database for all tutor documents
    const tutors = await Tutor.find();

    // If no tutors are found, return a 404
    if (!tutors || tutors.length === 0) {
      return res.status(404).json({ message: 'No tutors found' });
    }

    // Send back the list of tutors
    res.status(200).json(tutors);
  } catch (err) {
    console.error('Error retrieving tutors:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// Deletes tutor profiles completely for admin control
router.delete('/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized access' });

    jwt.verify(token, config.secret); // Just verify – if it fails, it'll throw

    const deleted = await Tutor.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Tutor not found' });

    res.json({ message: 'Tutor deleted successfully' });
  } catch (err) {
    console.error('Error deleting tutor:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/appointments', async (req, res) => {
  try {
  const token = req.headers.authorization?.split(" ")[1];  // Bearer <token>
  
  if (!token) {
    console.log("DINOSAURS")
      return res.status(401).json({ message: 'Unauthorized access' });
  }

  // Verify the token and extract the user ID
  const decoded = jwt.verify(token, process.env.JWT_SECRET); 
  const tutor = decoded.id;

  // Find appointments related to the user
  const appointments = await Appointment.find({ tutor })
  
  if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found for this user' });
  }
  res.status(200).json(appointments);
  } catch (err) {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/availableHours', async (req, res) => {
  try {
    const tutorId = req.body.id; // Get tutor's ID from URL
    const updatedAvailableHours = req.body.availableHours; // Get updated available hours from request body

    console.log(updatedAvailableHours[0])

    if (!updatedAvailableHours) {
      return res.status(400).json({ message: 'No available hours provided' });
    }

    // Find the tutor by ID and update their available hours
    const updatedTutor = await Tutor.findByIdAndUpdate(
      tutorId,
      { $set: { availableHours: updatedAvailableHours } }, // Update only the availableHours field
      { new: true } // Return the updated tutor
    );

    if (!updatedTutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    res.status(200).json(updatedTutor); // Send back the updated tutor
  } catch (err) {
    console.error('Error updating tutor available hours:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id/subjects', async (req, res) => {
  try {
    const tutorId = req.params.id; // Get tutor's ID from the URL
    const updatedSubjects = req.body.subjects; // Get subjects from request body

    if (!updatedSubjects || !Array.isArray(updatedSubjects)) {
      return res.status(400).json({ message: 'No subjects provided or invalid format' });
    }

    const updatedTutor = await Tutor.findByIdAndUpdate(
      tutorId,
      { $set: { subjects: updatedSubjects } },
      { new: true } // Return the updated document
    );

    if (!updatedTutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    res.status(200).json({ message: 'Subjects updated successfully', tutor: updatedTutor });
  } catch (err) {
    console.error('Error updating tutor subjects:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


export default router;