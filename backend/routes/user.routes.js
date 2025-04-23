// app/routes/user.routes.js
import express from "express";
import { adminBoard, allAccess, tutorBoard, userBoard } from "../controllers/user.controller.js";
import { authJwt } from "../middlewares/index.js";
 
const router = express.Router();
 
// Public route
router.get("/all", allAccess);
 
// User route (any authenticated user)
router.get("/user", [authJwt.verifyToken], userBoard);
 
// Moderator route
router.get("/tutor", [authJwt.verifyToken, authJwt.isTutor], tutorBoard);
 
// Admin route
router.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], adminBoard);
 
export default router;