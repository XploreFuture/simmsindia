import express from 'express'; // Use import for ES Modules
import Course from '../models/Course.js'; // Use import for ES Modules, ensure correct path and case

const router = express.Router();

// @desc    Add a new course
// @route   POST /api/courses/add
// @access  Public (add middleware if needed, e.g., protect, authorizeRoles)
router.post("/add", async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json({ message: "Course added successfully" });
  } catch (err) {
    console.error('Error adding course:', err); // More specific error logging
    // Handle duplicate key error specifically if serialno is unique in Course model
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Course with this serial number already exists.' });
    }
    res.status(500).json({ message: "Failed to add course", details: err.message }); // Provide detailed error
  }
});

// @desc    Fetch all courses
// @route   GET /api/courses
// @access  Public
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err); // More specific error logging
    res.status(500).json({ message: "Failed to fetch courses", details: err.message }); // Provide detailed error
  }
});

router.get('/name/:courseName', async (req, res) => { // Changed param name to courseName
  // Decode the course name from the URL to handle spaces (%20) and other special characters
  const decodedCourseName = decodeURIComponent(req.params.courseName);
  console.log(`[Course Route] Get course by Name request received for Name: "${decodedCourseName}"`);
  try {
    // Use findOne to search by name
    const course = await Course.findOne({ name: decodedCourseName });

    if (!course) {
      console.log(`[Course Route] Course not found for Name: "${decodedCourseName}"`);
      return res.status(404).json({ message: 'Course not found' });
    }

    console.log('[Course Route] Course found:', course.name);
    res.status(200).json(course);
  } catch (err) {
    console.error(`[Course Route] Error fetching course by name "${decodedCourseName}":`, err);
    res.status(500).json({ message: err.message || 'Error fetching course by name' });
  }
});

// Export the router as a default export for ES Modules
export default router;