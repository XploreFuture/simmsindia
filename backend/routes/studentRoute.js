
import express from 'express';
import Student from '../models/Student.js';
import protect from '../middlewares/authMiddleware.js'; // Your JWT protection middleware
import authorizeRoles from '../middlewares/authorizeRoles.js';

const router = express.Router();

// @desc    Add a new student/admission
// @route   POST /api/students/add
// @access  Private (Admin only) - Adjusted for consistency with management
router.post('/add', protect, authorizeRoles(['admin']), async (req, res) => {
  console.log('[Student Route] Add Student request received.');

  try {
    const {
      fullName,
      whatsapp,
      dob,
      Address,
      Course,
      Fname,
      Mname,
      religion,
      session,
    } = req.body;

    // Create new student record
    const student = await Student.create({
      fullName,
      whatsapp,
      dob,
      Address,
      Course,
      Fname,
      Mname,
      religion,
      session,
    });

    console.log('[Student Route] Student admission submitted successfully:', student._id);
    res.status(201).json({ message: 'Student admission submitted successfully', student });
  } catch (err) {
    console.error('[Student Route] Error adding student admission:', err);

    if (err.name === 'ValidationError') {
      const errors = Object.keys(err.errors).map(key => err.errors[key].message);
      return res.status(400).json({ message: 'Validation error', details: errors });
    }
    res.status(400).json({ message: err.message || 'Error submitting student admission' });
  }
});

// @desc    Get all students
// @route   GET /api/students
// @access  Private (Admin only)
router.get('/', protect,authorizeRoles(['admin']), async (req, res) => {
  console.log('[Student Route] Get all students request received.');
  try {
    const students = await Student.find({}); // Find all students
    console.log(`[Student Route] Found ${students.length} students.`);
    res.status(200).json(students);
  } catch (err) {
    console.error('[Student Route] Error fetching students:', err);
    res.status(500).json({ message: err.message || 'Error fetching students' });
  }
});

// @desc    Update a student by ID
// @route   PUT /api/students/:id
// @access  Private (Admin only)
router.put('/:id', protect, authorizeRoles(['admin']), async (req, res) => {
  console.log(`[Student Route] Update student request received for ID: ${req.params.id}`);
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find student by ID and update
    // { new: true } returns the updated document
    // { runValidators: true } ensures schema validators run on update
    const student = await Student.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!student) {
      console.log(`[Student Route] Student not found for ID: ${id}`);
      return res.status(404).json({ message: 'Student not found' });
    }

    console.log('[Student Route] Student updated successfully:', student._id);
    res.status(200).json({ message: 'Student updated successfully', student });
  } catch (err) {
    console.error(`[Student Route] Error updating student ${req.params.id}:`, err);
    if (err.name === 'ValidationError') {
      const errors = Object.keys(err.errors).map(key => err.errors[key].message);
      return res.status(400).json({ message: 'Validation error', details: errors });
    }
    res.status(400).json({ message: err.message || 'Error updating student' });
  }
});

// @desc    Delete a student by ID
// @route   DELETE /api/students/:id
// @access  Private (Admin only)
router.delete('/:id', protect,authorizeRoles(['admin']), async (req, res) => {
  console.log(`[Student Route] Delete student request received for ID: ${req.params.id}`);
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      console.log(`[Student Route] Student not found for ID: ${id}`);
      return res.status(404).json({ message: 'Student not found' });
    }

    console.log('[Student Route] Student deleted successfully:', student._id);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error(`[Student Route] Error deleting student ${req.params.id}:`, err);
    res.status(500).json({ message: err.message || 'Error deleting student' });
  }
});

export default router;