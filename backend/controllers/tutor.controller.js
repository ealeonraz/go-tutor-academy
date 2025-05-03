import jwt from "jsonwebtoken";
import Tutor from '../models/tutor.model.js';
import config from "../config/auth.config.js";

export const updateTutorSubjects = async (req, res) => {
    try {
      const userId = req.userId;
  
      const user = await db.user.findById(userId).populate("roles", "-__v");
  
      const hasTutorRole = user.roles.some(role => role.name === "tutor");
  
      if (!hasTutorRole) {
        return res.status(403).json({ message: "Access denied: Not a tutor" });
      }
  
      const tutor = await Tutor.findOne({ _id: userId });
      if (!tutor) return res.status(404).json({ message: "Tutor not found" });
  
      tutor.subjects = req.body.subjects;
      await tutor.save();
  
      return res.json({ message: "Subjects updated" });
    } catch (err) {
      console.error("Error in updateTutorSubjects:", err);
      return res.status(500).json({ message: "Server error" });
    }
  };
  