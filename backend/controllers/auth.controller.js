import config from '../config/auth.config.js';
import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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

