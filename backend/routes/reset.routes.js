import express from 'express';
import db from '../models/index.js';
import bcrypt from 'bcryptjs';

const router = express.Router();
const User = db.User;

router.post("/", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() } // Ensure it's not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Set new password
    user.password = bcrypt.hashSync(newPassword, 8);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    res.json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error during password reset." });
  }
});

export default router;
