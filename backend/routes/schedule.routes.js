// src/routes/tutorSchedule.routes.js
import express from 'express';
import TutorSchedule from '../models/tutorSchedule.model.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Get tutor's schedule
router.get('/schedule', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tutorId = decoded.id;

    // Find the tutor's schedule
    const schedule = await TutorSchedule.findOne({ tutorId });

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.status(200).json(schedule);
  } catch (err) {
    console.error('Error fetching schedule:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update tutor's schedule
router.post('/schedule', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tutorId = decoded.id;

    const newSchedule = req.body;

    // Find and update the tutor's schedule
    const schedule = await TutorSchedule.findOneAndUpdate(
      { tutorId },
      newSchedule,
      { new: true, upsert: true }
    );

    res.status(200).json(schedule);
  } catch (err) {
    console.error('Error updating schedule:', err);
    res.status(500).json({ message: 'Failed to update schedule' });
  }
});

export default router;
