import express from "express";
import db from "../models/index.js"; // Accessing mongoose instance here

const router = express.Router();

// Route to get all subjects
router.get('/', async (req, res) => {
    try {
        const data = await db.mongoose.connection.db.collection("subjects").find({}).toArray();

        if(!data || data.length === 0) {
            return res.status(404).json({ message: 'No subjects found' });
        }
        res.json(data);
    } catch(err) {
        console.error("Error fetching subjects ", err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// Route to add a new subject
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Subject name is required' });
        }

        // Insert the new subject into the database
        const result = await db.mongoose.connection.db.collection("subjects").insertOne({ name });

        if (result.acknowledged) {
            res.status(201).json({ message: 'Subject added successfully', subject: result.ops[0] });
        } else {
            res.status(400).json({ message: 'Failed to add subject' });
        }
    } catch(err) {
        console.error("Error adding subject: ", err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// Route to update a subject by id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Subject name is required' });
        }

        // Update the subject in the database
        const result = await db.mongoose.connection.db.collection("subjects").updateOne(
            { _id: db.mongoose.Types.ObjectId(id) },
            { $set: { name } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        res.json({ message: 'Subject updated successfully' });
    } catch(err) {
        console.error("Error updating subject: ", err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// Route to delete a subject by id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the subject from the database
        const result = await db.mongoose.connection.db.collection("subjects").deleteOne({ _id: db.mongoose.Types.ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        res.json({ message: 'Subject deleted successfully' });
    } catch(err) {
        console.error("Error deleting subject: ", err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

export default router;
