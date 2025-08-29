import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import emailService from "../services/emailService.js";

const router = express.Router();


// Remove signup GET route - not needed for API

router.post("/signup", async (req, res) => {
  try {
    console.log("Signup attempt:", req.body);
    const { username, email, password } = req.body;
    

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }
    
    const user = new User({ username, email, password });
    

    const verificationToken = user.generateEmailVerificationToken();
    await user.save();
    
    console.log("User created successfully");
    

    try {
      await emailService.sendWelcomeEmail(email, username);
      console.log("Welcome email sent");
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);

    }
    
    res.status(201).json({ 
      message: "Signup successful. A welcome email has been sent to your email address.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (err) {
    console.log("Signup error:", err.message);
    res.status(500).json({ message: err.message });
  }
});


// Remove login GET route - not needed for API

router.post("/login", async (req, res) => {
  try {
    console.log("Login attempt:", req.body);
    const {email, password} = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log("Login failed: Invalid credentials");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    console.log("Login successful");
    
    res.status(200).json({ 
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        role: user.role
      }
    });
  } catch (err) {
    console.log("Login error:", err.message);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
});


router.post("/logout", (req, res) => {
  // For JWT, logout is handled client-side by removing the token
  res.status(200).json({ message: "Logged out successfully" });
});


router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }
    
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    
    res.status(200).json({ message: "Email verified successfully! You can now login." });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: "Error verifying email. Please try again." });
  }
});


// Remove forgot-password GET route - not needed for API


router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent." });
    }
    
    const resetToken = user.generatePasswordResetToken();
    await user.save();
    
    try {
      await emailService.sendPasswordResetEmail(email, user.username, resetToken);
      console.log("Password reset email sent");
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      return res.status(500).json({ message: "Error sending password reset email. Please try again." });
    }
    
    res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent." });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: "Error processing password reset request. Please try again." });
  }
});


router.get("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }
    
    res.status(200).json({ message: "Valid reset token", token });
  } catch (error) {
    console.error('Password reset page error:', error);
    res.status(500).json({ message: "Error accessing password reset page" });
  }
});


router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }
    
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    
    res.status(200).json({ message: "Password reset successfully! You can now login with your new password." });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: "Error resetting password. Please try again." });
  }
});

export default router;
