import mongoose from 'mongoose'; // Use import for ES Modules

const centeraffilationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  centercode: {
    type: String,
    required: true,
    unique: true, // Center code should likely be unique
    trim: true,
  },
  qualification: {
    type: String,
    default: "",
    trim: true,
  },
  seatingcapacity: {
    type: String, // Consider changing to Number if it's a count
    required: true,
    trim: true,
  },
  strength: {
    type: String, // Consider changing to Number if it's a count
    required: true,
    trim: true,
  },
  noofsystem: {
    type: String, // Consider changing to Number if it's a count
    default: "",
    trim: true,
  },
  noofclassroom: {
    type: String, // Consider changing to Number if it's a count
    default: "",
    trim: true,
  },
  office: {
    type: String,
    enum: ['yes', 'no'],
    default: 'no'
  },
  receptiondesk: {
    type: String,
    enum: ['yes', 'no'],
    default: 'no'
  },
  toilet: {
    type: String,
    enum: ['yes', 'no'],
    default: 'no'
  },
  library: {
    type: String,
    enum: ['yes', 'no'],
    default: 'no'
  },
  website: {
    type: String,
    required: false,
    trim: true,
  },
  Contactno: {
    type: String, // String is fine for phone numbers to handle formatting like '+1-555-123-4567'
    required: true,
    trim: true,
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Export the model as a default export for ES Modules
const Centeraffilation = mongoose.model("Centeraffilation", centeraffilationSchema);
export default Centeraffilation;