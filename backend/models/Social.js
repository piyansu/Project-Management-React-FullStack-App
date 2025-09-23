import mongoose from "mongoose";
import crypto from 'crypto';

const SocialSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => crypto.randomBytes(4).toString('hex'),
        trim: true
    },
    // The user this social document belongs to
    userId: {
        type: String,
        ref: 'User',
        required: true,
        unique: true // Each user has one social document
    },
    // Array of user IDs who are confirmed friends
    friends: [{
        type: String,
        ref: 'User'
    }],
    friendRequests: {
        sent: [{
            _id: false, // Don't create a separate _id for subdocuments
            userId: { type: String, ref: 'User', required: true },
            status: { 
                type: String, 
                enum: ['pending', 'cancelled'], 
                default: 'pending' 
            }
        }],
        received: [{
            _id: false, // Don't create a separate _id for subdocuments
            userId: { type: String, ref: 'User', required: true },
            requestedAt: { type: Date, default: Date.now },
            status: { 
                type: String, 
                enum: ['pending', 'accepted', 'rejected'], 
                default: 'pending' 
            }
        }]
    }
}, { 
    timestamps: true 
});

SocialSchema.index({ userId: 1 });
SocialSchema.index({ friends: 1 });

SocialSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    }
});

const Social = mongoose.model('Social', SocialSchema);
export default Social;