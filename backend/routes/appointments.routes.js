import express from 'express'; // Importing express module
import jwt from 'jsonwebtoken'; // Importing jwt module for token verification
import Appointment from '../models/appointment.model.js'; // Importing Appointment model
import db from '../models/index.js';

const router = express.Router();

// Get appointments by user Object ID (from JWT token)

router.post('/create', async (req, res) => {
  const {tutor, start, end, subject, extendedProps } = req.body;
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({message: 'Unauthorized access'});
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const newAppointment = new Appointment({
      userId,
      tutor,
      start,
      end,
      subject,
      extendedProps,
    });

    await newAppointment.save();

    res.json(newAppointment);
    
  } catch(err) {
    console.error(err);
    res.status(500).json({err: "Error"})
  }
})

router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];  // Bearer <token>
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    // Verify the token and extract the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    const userId = decoded.id;

    // Find appointments related to the user
    const appointments = await Appointment.find({ userId })
    
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
