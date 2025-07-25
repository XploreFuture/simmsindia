// routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, email: user.email, role: user.role }, // <-- Include role here
        process.env.JWT_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || '15m' }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
    );
};

// Register Route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ username, email, password });
        await user.save();

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Store the refresh token (or its hash) in the database for revocation
        // For simplicity here, storing directly. In production, consider hashing this.
        user.refreshToken = refreshToken; // Hash this in real app
        await user.save();

        // Send refresh token as HttpOnly cookie for security
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure in production
            sameSite: 'Strict', // Protects against CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000 // Same as refresh token expiration
        });

        res.json({ accessToken });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Refresh Token Route
router.get('/refresh', async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); // No cookie, unauthorized

    const refreshToken = cookies.jwt;

    try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Find user by ID from decoded refresh token
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) { // Also check if stored refresh token matches
            return res.sendStatus(403); // Forbidden
        }

        // Generate a new access token
        const newAccessToken = generateAccessToken(user);

        res.json({ accessToken: newAccessToken });

    } catch (err) {
        // If refresh token is expired or invalid
        if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
             // Clear the expired/invalid cookie
            res.clearCookie('jwt', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict'
            });
            return res.sendStatus(403); // Forbidden
        }
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Logout Route
router.post('/logout', async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content to send back

    const refreshToken = cookies.jwt;

    try {
        // Find user by refresh token (or its hash in production)
        const user = await User.findOne({ refreshToken });

        if (user) {
            user.refreshToken = null; // Clear the refresh token
            await user.save();
        }

        res.clearCookie('jwt', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });
        res.sendStatus(204); // Success, no content

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/forgotpassword', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      // Always send a success message to prevent email enumeration
      return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    // Set token and expiration on the user model
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 3600000; // Token valid for 1 hour (3600000 ms)

    await user.save();

    // Create reset URL for the frontend
    // IMPORTANT: Replace 'http://localhost:5173' with your actual frontend URL in production
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      // You'll need to implement this sendEmail utility
      // await sendEmail({
      //   to: user.email,
      //   subject: 'Password Reset Token',
      //   text: message,
      // });

      console.log(`Password reset email simulated for ${user.email}. Link: ${resetUrl}`); // Log for development
      res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    } catch (error) {
      console.error('Error sending password reset email:', error);
      // If email sending fails, clear the token from the user to prevent invalid tokens
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ message: 'Email could not be sent. Please try again later.' });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error during password reset request.' });
  }
});

export default router;