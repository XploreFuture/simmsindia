import express from 'express'; // Use import for ES Modules
import Certificate from '../models/certificate.js'; // Use import for ES Modules, ensure correct path and case

const router = express.Router();

// @desc    Add a new certificate
// @route   POST /api/certificates/add
// @access  Public (or add middleware if needed)
router.post('/add', async (req, res) => {
  try {
    const newCertificate = new Certificate(req.body);
    await newCertificate.save();
    res.status(201).json({ message: 'Certificate added successfully' });
  } catch (err) {
    console.error('Error adding certificate:', err); // More specific error logging
    // Handle duplicate key error specifically if registrationno is unique
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Certificate with this registration number already exists.' });
    }
    res.status(400).json({ message: err.message || 'Error adding certificate' }); // Provide a fallback message
  }
});

// @desc    Get certificate by registration number
// @route   GET /api/certificates/:registrationno
// @access  Public
router.get('/:registrationno', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ registrationno: req.params.registrationno });
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    res.json(certificate);
  } catch (err) {
    console.error('Error fetching certificate by registration number:', err); // More specific error logging
    res.status(500).json({ message: err.message || 'Server error while fetching certificate' }); // Provide a fallback message
  }
});

// Export the router as a default export for ES Modules
export default router;