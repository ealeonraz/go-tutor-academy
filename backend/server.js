import express from "express";
import cors from "cors";
import db from "./models/index.js";
import authRoutes from "./routes/auth.routes.js";  // Authentication routes
import userRoutes from "./routes/user.routes.js";  // User routes
import reviewRoutes from "./routes/reviews.routes.js";  // Reviews routes (if added)
import feedbackRoutes from "./routes/feedback.routes.js"; // Feedback routes
import appointmentRoutes from "./routes/appointments.routes.js"; // Appointment routes
import tutorRoutes from "./routes/tutor.routes.js"; // Tutor routes
import infoRoutes from "./routes/info.routes.js"; // Info routes
import studentRoutes from "./routes/student.routes.js"; // Student routes
import subjectRoutes from "./routes/subjects.routes.js"
import eventRoutes from "./routes/events.routes.js"
import noteRoutes from "./routes/notes.routes.js"
import resetRoutes from "./routes/reset.routes.js"; // Reset password routes
import searchRoutes from "./routes/searchRoutes.js";  // Search routes

const app = express();
const PORT = 4000;

const corsOptions = {
  origin: 'http://localhost:5173',  // Update to match the frontend port
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  // Allow cookies and credentials (important for handling token with requests)
};

app.use(cors(corsOptions));  // Use CORS with the updated options

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes setup
app.use("/api/auth", authRoutes);
app.use("/api/test", userRoutes);
app.use("/api/reviews", reviewRoutes);  
app.use("/api/feedback", feedbackRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/subjects", subjectRoutes)
app.use("/api/tutors", tutorRoutes);  // Tutor routes
app.use("/api/info", infoRoutes);  // Info routes
app.use("/api/students", studentRoutes);  // Student routes
app.use("/api/events", eventRoutes);
app.use("/api/tutor-notes", noteRoutes);
app.use("/api/reset-password", resetRoutes);  // Reset password routes
app.use('/api/search', searchRoutes);
app.use('/api/filters', searchRoutes);

// Connect to MongoDB
db.mongoose
  .connect(process.env.MON_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    initial();  // Initialize roles in the database
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}.`);
    });
  })
  .catch((err) => {
    console.error("Connection error:", err);
    process.exit();
  });

// Initialize roles function
function initial() {
  db.Role.estimatedDocumentCount()
    .then((count) => {
      if (count === 0) {
        return Promise.all([
          new db.Role({ name: "admin" }).save(),
          new db.Role({ name: "tutor" }).save(),
          new db.Role({ name: "student" }).save(),
        ]);
      }
    })
    .then((roles) => {
      if (roles) {
        console.log("Added roles:", roles.map(role => role.name).join(', '));  // Logging role names
      }
    })
    .catch((err) => {
      console.error("Error initializing roles", err);
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);  // Log the error stack
  res.status(500).json({ error: "Internal Server Error" });
});
