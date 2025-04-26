// Route to get upcoming appointments
router.get('/', async (req, res) => {
    try {
        // Get the current date and time
        const now = new Date();

        // Query appointments where the 'start' date is in the future
        const upcomingAppointments = await db.mongoose.connection.db.collection("appointments")
            .find({ start: { $gte: now } })
            .sort({ start: 1 })  // Sorting by date in ascending order
            .toArray();

        if (!upcomingAppointments || upcomingAppointments.length === 0) {
            return res.status(404).json({ message: 'No upcoming appointments found' });
        }

        res.json(upcomingAppointments);  // Send back the list of upcoming appointments
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});
