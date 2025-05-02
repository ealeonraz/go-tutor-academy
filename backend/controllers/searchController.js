import db from '../models/index.js';
import { ObjectId } from 'mongodb';

export const searchTutors = async (req, res) => {
  try {
    const { q, subjects, ratings, availability } = req.query;

    const usersCol = db.mongoose.connection.db.collection("users");
    const rolesCol = db.mongoose.connection.db.collection("roles");

    // Get the ObjectId for the 'tutor' role
    const tutorRoleDoc = await rolesCol.findOne({ name: "tutor" });
    if (!tutorRoleDoc) return res.status(500).json({ message: "Tutor role not found." });

    const query = {
      roles: tutorRoleDoc._id  // roles is an array of ObjectIds
    };

    // 🔍 Free text query for name or subject
    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      query.$or = [
        { firstName: { $regex: regex } },
        { lastName: { $regex: regex } },
        { subjects: { $regex: regex } }
      ];
    }

    // 📘 Subject filter
    if (subjects) {
      const subjectArray = Array.isArray(subjects) ? subjects : [subjects];
      query.subjects = { $in: subjectArray };
    }

    // ⭐ Rating filter (optional if stored later)
    if (ratings) {
      const ratingArray = Array.isArray(ratings) ? ratings.map(Number) : [parseInt(ratings)];
      query.rating = { $in: ratingArray };
    }

    // 🕒 Availability filter (check if any 'day' matches)
    if (availability) {
      const availabilityDays = Array.isArray(availability) ? availability : [availability];
      query.availableHours = {
        $elemMatch: {
          day: { $in: availabilityDays.map(d => d.toLowerCase()) } // lowercase to match db
        }
      };
    }

    const tutors = await usersCol
      .find(query)
      .project({ password: 0 })
      .toArray();

    res.status(200).json(tutors);
  } catch (err) {
    console.error("❌ Error searching tutors:", err);
    res.status(500).json({ message: "Server error during search.", error: err.message });
  }
};
