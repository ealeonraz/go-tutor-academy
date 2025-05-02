import config from '../config/auth.config.js';
import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from "crypto";
import sendEmail from "../services/sendEmail.js";
import Action from '../models/action.model.js';  

const User = db.User;
const Role = db.Role;


export const signup = async (req, res) => {
  try {
    const { first, last, email, password, role } = req.body;
    
    // Create a new user with the correct fields
    const user = new User({
      firstName: first,   
      lastName: last,     
      email: email,       
      password: bcrypt.hashSync(password, 8), // Hash the password
    });
    
    // Find the role document in the Role collection
    const roleDoc = await Role.findOne({ name: role }); 
    if (!roleDoc) {
      return res.status(400).json({ message: "Student role not found!" });
    }
    
    user.roles = [roleDoc._id];

    // Save the user
    await user.save();

    // Log the action: Account Created
    await Action.create({
      action_type: 'account_created',
      user_id: user._id,  // The user who triggered the action
      related_entity_id: user._id,  // Relate to the user
      metadata: {
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
      }
    });

    res.status(201).json({ message: 'User was registered as a student successfully!' });
  } catch (err) {
    console.error("Error in signup:", err);
    res.status(500).json({ message: err.message });
  }
};



 
export const signin = async (req, res) => {
  try {
    // Find user by email
    const user = await User.findOne({ email: req.body.email }).populate('roles', '-__v');
    
    if (!user) {
      return res.status(404).json({ message: 'User Not found.' });
    }

    // Check if the password hash matches
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    
    if (passwordIsValid) {
      // Generate the JWT token
// In auth.controller.js during signin:
      const token = jwt.sign(
        { id: user.id, email: user.email }, 
        config.secret, 
        { expiresIn: 86400 }
      );
      
      console.log(`Token is ${token}`)
      // Extract user roles
      const authorities = user.roles.map((role) => `${role.name}`);

      return res.status(200).json({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: authorities,
        accessToken: token,
        profilePhoto: user.profileLink,
        subjects: user.subjects,
        tutor: user.tutor,
      });
    }

    // If no valid password is found
    return res.status(401).json({
      accessToken: null,
      message: 'Invalid Password!',
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Create reset token and expiration date, in 1 hour.
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 3600000;

    user.resetToken = token;
    user.resetTokenExpiration = expiry;
    await user.save();

    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    // Send email HTML with reset link
    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="text-align: center;">
            <img src="https://i.imgur.com/UEcc34v.png" alt="GoTutor Academy Logo" style="width: 240px; margin-bottom: 20px;" />
            <h2>Reset Your Password</h2>
          </div>
          <p style="font-size: 16px;">Hi there,</p>
          <p style="font-size: 16px;">
            We received a request to reset your password. Click the button below to continue:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" <a href="#" style="
              min-width: 150px;
              padding: 0 20px;
              height: 50px;
              border-radius: 25px;
              background-color: #000000;
              color: white;
              border: 2px solid black;
              font-size: 18px;
              line-height: 50px;
              text-align: center;
              font-weight: 600;
              margin-top: 5px;
              margin-bottom: 5px;
              cursor: pointer;
              display: inline-block;
              text-decoration: none;
            ">
            Reset Password    
            </a>
          </div>
          <p style="font-size: 14px; color: #888;">
            If you didn’t request this, you can safely ignore this email. This link will expire in 1 hour.
          </p>
          <p style="margin-top: 30px; font-size: 14px; color: #aaa;">– The GoTutor Academy Team</p>
        </div>
      </div>
    `;

    await sendEmail(user.email, "Password Reset", html);

    res.json({ message: "Reset link sent to your email." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};