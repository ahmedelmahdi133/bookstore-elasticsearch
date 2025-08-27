import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import emailService from '../services/emailService.js';
export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        
        const user = await User.create({ username, email, password });
        

        const verificationToken = user.generateEmailVerificationToken();
        await user.save();
        

        try {
            await emailService.sendWelcomeEmail(email, username);
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);

        }
        
        res.status(201).json({ 
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.status(200).json({ 
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isEmailVerified: user.isEmailVerified,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
};


export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        });
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification token' });
        }
        
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();
        
        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ message: 'Error verifying email' });
    }
};


export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {

            return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
        }
        
        const resetToken = user.generatePasswordResetToken();
        await user.save();
        
        try {
            await emailService.sendPasswordResetEmail(email, user.username, resetToken);
        } catch (emailError) {
            console.error('Failed to send password reset email:', emailError);
            return res.status(500).json({ message: 'Error sending password reset email' });
        }
        
        res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    } catch (error) {
        console.error('Password reset request error:', error);
        res.status(500).json({ message: 'Error processing password reset request' });
    }
};


export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }
        
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ message: 'Error resetting password' });
    }
};  