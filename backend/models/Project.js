import mongoose from "mongoose";
import crypto from 'crypto';

// Simple function to get IST formatted date
function getISTDateTime() {
    return new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
}

const projectSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => crypto.randomBytes(4).toString('hex'),
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    ownerId: {
        type: String,
        required: true,
        ref: 'User'
    },
    members: [{
        type: String,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['Active', 'Completed', 'On Hold', 'Cancelled'],
        default: 'Active',
        trim: true
    },
    priority: {
        type: String,
        enum: ['Urgent', 'High', 'Medium', 'Low'],
        default: 'Medium',
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value > this.startDate;
            },
            message: 'Due date must be after start date'
        }
    },
    createdAt: {
        type: String,
        default: getISTDateTime,
    },
    updatedAt: {
        type: String,
        default: getISTDateTime,
    }
});

// Update the updatedAt field on save
projectSchema.pre('save', function (next) {
    if (!this.isNew) {
        this.updatedAt = getISTDateTime();
    }
    next();
});

// Add indexes for better query performance
projectSchema.index({ ownerId: 1 });
projectSchema.index({ members: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ priority: 1 });
projectSchema.index({ dueDate: 1 });

// Clean up JSON output
projectSchema.set('toJSON', {
    transform: (doc, ret) => {
        // delete ret._id;
        delete ret.__v;
        return ret;
    }
});

const Project = mongoose.model("Project", projectSchema);
export default Project;