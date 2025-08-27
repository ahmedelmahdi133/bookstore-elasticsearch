import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import emailService from "../services/emailService.js";

const router = express.Router();


router.get("/signup", (req, res) => {
  res.render("auth/signup", { title: "Signup" });
});

router.post("/signup", async (req, res) => {
  try {
    console.log("Signup attempt:", req.body);
    const { username, email, password } = req.body;
    

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "User with this email already exists");
      return res.redirect("/auth/signup");
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
    
    req.flash("success", "Signup successful. A welcome email has been sent to your email address. Please login.");
    return res.redirect("/auth/login");
  } catch (err) {
    console.log("Signup error:", err.message);
    req.flash("error", err.message);
    return res.redirect("/auth/signup");
  }
});


router.get("/login", (req, res) => {
  res.render("auth/login", { title: "Login" });
});

router.post("/login", async (req, res) => {
  try {
    console.log("Login attempt:", req.body);
    const {email, password} = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log("Login failed: Invalid credentials");
      req.flash("error", "Invalid credentials");
      return res.redirect("/auth/login");
    }

    req.session.user = { id: user._id, username: user.username, role: user.role };
    console.log("Login successful, redirecting to home");
    req.flash("success", "Logged in successfully!");
    return res.redirect("/");
  } catch (err) {
    console.log("Login error:", err.message);
    req.flash("error", "Login failed. Please try again.");
    return res.redirect("/auth/login");
  }
});


router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});


router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      req.flash("error", "Invalid or expired verification token");
      return res.redirect("/auth/login");
    }
    
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    
    req.flash("success", "Email verified successfully! You can now login.");
    return res.redirect("/auth/login");
  } catch (error) {
    console.error('Email verification error:', error);
    req.flash("error", "Error verifying email. Please try again.");
    return res.redirect("/auth/login");
  }
});


router.get("/forgot-password", (req, res) => {
  res.render("auth/forgot-password", { title: "Forgot Password" });
});


router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      req.flash("success", "If an account with that email exists, a password reset link has been sent.");
      return res.redirect("/auth/forgot-password");
    }
    
    const resetToken = user.generatePasswordResetToken();
    await user.save();
    
    try {
      await emailService.sendPasswordResetEmail(email, user.username, resetToken);
      console.log("Password reset email sent");
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      req.flash("error", "Error sending password reset email. Please try again.");
      return res.redirect("/auth/forgot-password");
    }
    
    req.flash("success", "If an account with that email exists, a password reset link has been sent.");
    return res.redirect("/auth/forgot-password");
  } catch (error) {
    console.error('Password reset request error:', error);
    req.flash("error", "Error processing password reset request. Please try again.");
    return res.redirect("/auth/forgot-password");
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
      req.flash("error", "Invalid or expired reset token");
      return res.redirect("/auth/forgot-password");
    }
    
    res.render("auth/reset-password", { title: "Reset Password", token });
  } catch (error) {
    console.error('Password reset page error:', error);
    req.flash("error", "Error accessing password reset page");
    return res.redirect("/auth/forgot-password");
  }
});


router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    
    if (password !== confirmPassword) {
      req.flash("error", "Passwords do not match");
      return res.redirect(`/auth/reset-password/${token}`);
    }
    
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      req.flash("error", "Invalid or expired reset token");
      return res.redirect("/auth/forgot-password");
    }
    
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    
    req.flash("success", "Password reset successfully! You can now login with your new password.");
    return res.redirect("/auth/login");
  } catch (error) {
    console.error('Password reset error:', error);
    req.flash("error", "Error resetting password. Please try again.");
    return res.redirect(`/auth/reset-password/${req.params.token}`);
  }
});

export default router;
