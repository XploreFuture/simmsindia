import mongoose from 'mongoose'; // Use import for ES Modules

const studentSchema = new mongoose.Schema({
  // Removed: uid field
  // Removed: email field
  
  fullName: { 
    type: String, 
    default: "",
    trim: true 
  },
  whatsapp: { 
    type: String, 
    default: "",
    trim: true 
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function (value) {
        const today = new Date();
        const minDate = new Date(today.getFullYear() - 9, today.getMonth(), today.getDate());
        return value <= minDate; // Ensure user is at least 9 years old
      },
      message: 'User must be at least 9 years old',
    },
  },
  role: { // This 'role' field in Student model seems redundant if Student is not a User.
          // If a student can be an 'admin' or 'user' in the context of the *student record itself*, keep it.
          // Otherwise, consider removing or renaming to avoid confusion with User model's role.
    type: String,
    enum: ['user', 'admin'], 
    default: 'user'
  },
  Address: { 
    type: String, 
    required: true,
    trim: true 
  },
  Course: { 
    type: String, 
    required: true,
    trim: true 
  },
  Fname: { 
    type: String, 
    required: true,
    trim: true 
  },
  Mname: { 
    type: String, 
    required: true,
    trim: true 
  },
  religion: {
    type: String,
    enum: ['Hinduism', 'Islam', 'Christianity', 'Sikhism', 'Buddhism', 'Jainism', 'Other', 'Prefer not to say', ''],
    default: '' 
  },
  session: { 
    type: String, 
    required: true,
    trim: true 
  },
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

// Export the model as a default export for ES Modules
const Student = mongoose.model('Student', studentSchema);
export default Student;