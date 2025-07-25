import mongoose from 'mongoose'; // Use import for ES Modules

const certificateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  fathername: {
    type: String,
    required: true,
    trim: true,
  },
  mothername: {
    type: String,
    required: true,
    trim: true,
  },
  course: {
    type: String,
    default: "",
    trim: true,
  },
  registrationno: {
    type: String,
    required: true,
    unique: true, // Registration number should ideally be unique
    trim: true,
  },
  Address: {
    type: String,
    required: true,
    trim: true,
  },
  centername: {
    type: String,
    default: "",
    trim: true,
  },
  grade: {
    type: String,
    default: "",
    trim: true,
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Export the model as a default export for ES Modules
const Certificate = mongoose.model("Certificate", certificateSchema);
export default Certificate;