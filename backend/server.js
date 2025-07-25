import dotenv from 'dotenv'; // Use import for ES Modules
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Import your route files using ES Module syntax
import authRoutes from './routes/auth.js'; // Ensure this file is also using ES Modules
import studentRoute from './routes/studentRoute.js'; // Assuming you renamed studentRoute.js to student.js
import centerRoute from './routes/centerRoute.js'; // Assuming you renamed centerRoute.js to centeraffilation.js
import certificateRoute from './routes/certificateRoute.js'; // Assuming you renamed certificateRoute.js to certificate.js
import courseRoute from './routes/courseRoute.js'; // Assuming you renamed courseRoute.js to course.js
import profileRoutes from './routes/profile.js'; // New: Import profile routes

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware
// Enable CORS for your frontend origin
app.use(cors({ 
  origin: "http://localhost:5173", // Replace with your frontend URL
  credentials: true // Allow cookies to be sent
})); 
app.use(express.json()); // Body parser for JSON data
app.use(cookieParser()); // Cookie parser for handling cookies

// Mount your API routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoute);
app.use("/api/center", centerRoute); // Ensure this matches the base path you want for center affiliations
app.use("/api/certificates", certificateRoute);
app.use("/api/courses", courseRoute);
app.use("/api/profile", profileRoutes); // New: Mount profile routes

// Simple root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully!");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit process with failure
  }
};

startServer();