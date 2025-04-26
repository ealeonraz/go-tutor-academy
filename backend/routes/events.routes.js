// eventRoutes.js

import express from 'express';
import db from '../models/index.js'; // Assuming db is your database connection
const router = express.Router();

// Route to get scheduled appointments this month
router.get('/this-month', async (req, res) => {
    try {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        const appointments = await db.mongoose.connection.db.collection("appointments")
            .find({
                start: { $gte: startOfMonth, $lt: endOfMonth }
            })
            .toArray();

        res.json(appointments);  // Send back the appointment data for this month
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// Route to get upcoming appointments (appointments in the future)
router.get('/upcoming', async (req, res) => {
    try {
        const now = new Date();

        const upcomingAppointments = await db.mongoose.connection.db.collection("appointments")
            .find({
                start: { $gte: now }  // Future appointments
            })
            .toArray();

        res.json(upcomingAppointments);  // Send back upcoming appointments data
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

export default router;
