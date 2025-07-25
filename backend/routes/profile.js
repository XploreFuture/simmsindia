import express from 'express';
import protect from '../middlewares/authMiddleware.js'; // Your JWT protection middleware
import User from '../models/User.js'; // Your User model

const router = express.Router();

// @desc    Get authenticated user's profile
// @route   GET /api/profile
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        // req.user is populated by the protect middleware, it contains the user object
        // We select specific fields, excluding sensitive ones like password and refreshToken
        const user = await User.findById(req.user._id).select('-password -refreshToken'); 

        if (!user) {
            console.warn(`[Profile Route] User profile not found for ID: ${req.user._id}`);
            return res.status(404).json({ message: 'User profile not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('[Profile Route] Error fetching user profile:', err.message);
        res.status(500).json({ message: 'Server Error while fetching profile', details: err.message });
    }
});

// @desc    Update authenticated user's profile
// @route   PUT /api/profile
// @access  Private
router.put('/', protect, async (req, res) => {
    // Destructure only the fields that are allowed to be updated and exist in the schema
    const { gender, dob } = req.body;

    // Build an update object based on provided fields
    const profileFields = {};
    if (gender) profileFields.gender = gender;
    if (dob) profileFields.dob = dob; // Ensure DOB is a valid date string or Date object from frontend

    // Removed: collegeName, avatar, social fields as per updated User model
    // if (collegeName) profileFields.collegeName = collegeName;
    // if (avatar) profileFields.avatar = avatar;
    // if (social) { ... }

    try {
        // Find the user by ID from the authenticated request
        let user = await User.findById(req.user._id); 

        if (!user) {
            console.warn(`[Profile Route] User not found for update with ID: ${req.user._id}`);
            return res.status(404).json({ message: 'User not found' });
        }

        // Use findByIdAndUpdate to update the user's profile
        user = await User.findByIdAndUpdate(
            req.user._id, // Use the ID from req.user
            { $set: profileFields }, // $set updates only the provided fields
            { new: true, runValidators: true } // Return the updated document, run schema validators
        ).select('-password -refreshToken'); // Exclude sensitive fields from the response

        res.json(user);

    } catch (err) {
        console.error('[Profile Route] Error updating user profile:', err.message);
        // Handle Mongoose validation errors
        if (err.name === 'ValidationError') {
            const errors = Object.keys(err.errors).map(key => err.errors[key].message);
            return res.status(400).json({ message: 'Validation error during profile update', details: errors });
        }
        res.status(500).json({ message: 'Server Error while updating profile', details: err.message });
    }
});

// @desc    Get any user profile by ID (Publicly accessible, but selects limited fields)
// @route   GET /api/profile/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Select public fields. Removed collegeName, avatar, social.
        const user = await User.findById(id).select('username email gender dob createdAt role');

        if (!user) {
            console.warn(`[Profile Route] User not found for public view with ID: ${id}`);
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('[Profile Route] Error fetching single user profile by ID:', error.message);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID format.' });
        }
        res.status(500).json({ message: 'Server error while fetching user profile by ID.', details: error.message });
    }
});

export default router;