import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";
import connectDB from "./database/db.js"; // Import the database connection function

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

async function startServer() {
  try {
    const db = await connectDB(); // Connect to MongoDB
    
    app.use((req, res, next) => {
      console.log("Incoming request:", req.method,req.url);
      next();
    }); // Middleware to log incoming requests
    app.use("/api",routes); // Use routes after database is connected

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

startServer();
