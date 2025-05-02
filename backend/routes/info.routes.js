import express from "express";
import db from "../models/index.js"; // Accessing mongoose instance here
import jwt from 'jsonwebtoken'; // Importing jwt module for token verification
const router = express.Router();

// Route to get user by email (based on the decoded JWT)
router.get('/:id', async (req, res) => {
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
                    roleId: "$roleDetails._id"  // Include the ObjectId of the role
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

router.get('/', async (req, res) => { 
    
})

export default router;
