import express from "express";
import cors from "cors";
import db from "./models/index.js";
import authRoutes from "./routes/auth.routes.js";  // Authentication routes
import userRoutes from "./routes/user.routes.js";  // User routes
import reviewRoutes from "./routes/reviews.routes.js";  // Reviews routes (if added)
import feedbackRoutes from "./routes/feedback.routes.js"
import appointmentRoutes from "./routes/appointments.routes.js"

const app = express();
const PORT = process.env.PORT || 4000;

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



