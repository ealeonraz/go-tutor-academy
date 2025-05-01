// app/routes/auth.routes.js
import express from 'express';
import { signup, signin } from '../controllers/auth.controller.js';
import { verifySignUp } from '../middlewares/index.js';
import { forgotPassword } from '../controllers/auth.controller.js';
 
const router = express.Router();
 
// Signup route
router.post(
  '/signup',
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
  signup
);
 
// Signin route
router.post('/signin', signin);

// Forgot password route
router.post('/forgot-password', forgotPassword);

export default router;