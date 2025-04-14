import express from "express";
import db from "../models/index.js"; // Accessing mongoose instance here
const router = express.Router();

// Route to fetch all reviews
router.get("/", async (req, res) => {
  try {
    // Fetch all reviews from the 'reviews' collection
    const reviews = await db.mongoose.connection.db.collection("reviews").find({}).toArray();

    // Check if reviews exist and send an empty array if no reviews found
    if (reviews.length === 0) {
      return res.status(200).json([]);  // Empty array if no reviews found
    }

    res.status(200).json(reviews);  // Send reviews as a JSON response
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});


export default router;
