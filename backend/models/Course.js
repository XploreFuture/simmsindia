import mongoose from 'mongoose'; // Use import for ES Modules

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  serialno: {
    type: String,
    required: true,
    unique: true, // Serial number should likely be unique
    trim: true,
  },
  duration: {
    type: String, // Consider changing to Number if it's a numerical duration
    required: true,
    trim: true,
  },
  eligibility: {
    type: String,
    default: "",
    trim: true,
  },
  coursefee: {
    type: String, // Consider changing to Number if it's a numerical fee
    required: true,
    trim: true,
  },
  schilarship: { // Typo: 'schilarship' -> 'scholarship'
    type: String, // Consider changing to Number if it's a numerical value
    required: true,
    trim: true,
  },
  details: {
    type: String,
    default: "",
    trim: true,
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Export the model as a default export for ES Modules
const Course = mongoose.model("Course", courseSchema);
export default Course;
