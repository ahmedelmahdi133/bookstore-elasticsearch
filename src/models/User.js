import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date }
}, { timestamps: true });


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateEmailVerificationToken = function(){
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.emailVerificationToken = token;
    this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    return token;
};
userSchema.methods.generatePasswordResetToken = function(){
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.passwordResetToken = token;
    this.passwordResetExpires = Date.now() + 60 * 60 * 1000;
    return token;
};
const User = mongoose.model('User', userSchema);
export default User;