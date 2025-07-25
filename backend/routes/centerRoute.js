import express from 'express'; // Use import for ES Modules
import Centeraffilation from '../models/centeraffilation.js'; // Use import for ES Modules, ensure correct path and case
import protect from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/authorizeRoles.js';

const router = express.Router();

// POST center affiliation form (🔐 protected)
router.post('/add',  protect, authorizeRoles(['admin']), async (req, res) => {
  try {
    const center = await Centeraffilation.create(req.body);
    res.status(201).json({ message: 'Center affiliation submitted successfully', center });
  } catch (err) {
    console.error('Error adding center affiliation:', err); // More specific error logging
    res.status(400).json({ message: err.message || 'Error submitting center affiliation' }); // Provide a fallback message
  }
});

// GET all center affiliations
router.get("/", async (req, res) => {
  try {
    const centers = await Centeraffilation.find();
    res.json(centers);
  } catch (err) {
    console.error('Error fetching center affiliations:', err); // More specific error logging
    res.status(500).json({ message: "Server error while fetching center affiliations" }); // More specific error message
  }
});

router.get('/code/:centerCode', async (req, res) => {
  const decodedCenterCode = decodeURIComponent(req.params.centerCode);
  try {
    const center = await Center.findOne({ centercode: decodedCenterCode });
    // ... handle found/not found ...
  } catch (err) {
    // ... handle errors ...
  }
});
// Export the router as a default export for ES Modules
export default router;