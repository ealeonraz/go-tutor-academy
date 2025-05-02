// backend/routes/tutor.routes.js

import express from 'express'; // Import Express for routing
import jwt from 'jsonwebtoken'; // JSON Web Token for authentication
import Tutor from '../models/tutor.model.js'; // Tutor model for database interaction
import db from '../models/index.js'; 
import config from '../config/auth.config.js';
import Appointment from '../models/appointment.model.js'; // Importing Appointment model



const router = express.Router();


router.get('/:id/info', async (req, res) => {
  try {
    const tutorId = req.params.id; // Get tutor's ID from the request URL
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from headers

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    // Verify the token and decode the payload
    const decoded = jwt.verify(token, config.secret);

    // Find the tutor by ID and populate their available time slots
    const tutor = await Tutor.findById(tutorId);

    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    // Assuming Tutor schema has a field called availableHours for availability
    const tutorInfo = {
      id: tutor._id,
      name: `${tutor.firstName} ${tutor.lastName}`,
      subjects: tutor.subjects,
      availableSlots: tutor.availableHours, // Assume availableHours is an array of time slots
    };

    res.status(200).json(tutorInfo); // Send the tutor's information and availability

  } catch (err) {
    console.error('Error retrieving tutor info:', err);
    res.status(500).json({ message: 'Server error' });
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
export default router;