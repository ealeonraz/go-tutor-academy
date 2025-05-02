import express from 'express'; 
import jwt from 'jsonwebtoken'; 
import Appointment from '../models/appointment.model.js'; 
import Action from '../models/action.model.js';
import Tutor from '../models/tutor.model.js';

const router = express.Router();

// Create an appointment
router.post('/create', async (req, res) => {
  const { tutor, start, end, subject, extendedProps } = req.body;

  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;  // Extract userId from the JWT token

    const startTime = new Date(start);
    const endTime = new Date(end);

    // Ensure the tutor exists by validating the tutor's ObjectId
    const selectedTutor = await Tutor.findById(tutor);
    if (!selectedTutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    // Create a new appointment with tutor's ObjectId (as reference)
    const newAppointment = new Appointment({
      userId,
      tutor,  // Store tutor's ObjectId
      start: startTime,
      end: endTime,
      subject,
      extendedProps,
    });

    await newAppointment.save();

    // Log the action: Appointment Created
    await Action.create({
      action_type: 'appointment_scheduled',
      user_id: userId,
      related_entity_id: newAppointment._id,
      metadata: {
        tutor,
        subject,
        start: startTime,
        end: endTime,
      },
    });

    // Respond with the newly created appointment
    res.status(201).json(newAppointment);

  } catch (err) {
    console.error("Error creating appointment:", err);
    res.status(500).json({ error: "Error creating appointment" });
  }
});


// Delete an appointment by ID
router.delete('/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find and delete the appointment
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await Appointment.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    console.error('Error deleting appointment:', err);
    res.status(500).json({ error: 'Error deleting appointment' });
  }
});

// Get appointments for the logged-in user
router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];  // Bearer <token>
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

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
