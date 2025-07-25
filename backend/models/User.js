import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: false,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    refreshToken: {
        type: String,
        default: null,
    },
    role: {
        type: String,
        enum: ['user', 'admin'], 
        default: 'user',
        required: true 
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
        default: 'Prefer not to say'
    },
    dob: {
        type: Date,
        default: null
    },
    resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.getResetPasswordToken = function () {
  // Generate a random 20-byte hexadecimal string for the token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash the resetToken and store it in the database
  // The token stored in the database is hashed, so if someone gets access
  // to your database, they don't get the plain-text token.
  this.resetPasswordToken = crypto
    .createHash('sha256') // Use SHA256 for hashing
    .update(resetToken)
    .digest('hex');

  // Set the expiration time for the token (e.g., 10 minutes from now)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds

  // Return the unhashed token, which will be sent to the user's email
  // This is the token that will be in the reset link URL.
  return resetToken;
};


const User = mongoose.model('User', UserSchema);
export default User;
