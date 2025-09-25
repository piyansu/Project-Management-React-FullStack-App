import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => crypto.randomBytes(4).toString('hex'),
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
        type: String,
        required: function () { return !this.googleId; },
        trim: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    otp: {
        type: String,
        trim: true
    },
    otpExpires: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    profilePhoto: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 250,
        default: 'I am ProjectMan'
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    lastSeen: {
        type: Date
    }
}, { timestamps: true });

// Hash password if modified
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Password comparison method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Add indexes for better query performance
userSchema.index({ _id: 1 });
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });


// Clean up JSON output
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
    }
});

const User = mongoose.model("User", userSchema);
export default User;
