import mongoose from "mongoose";
import crypto from 'crypto';

const taskSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => crypto.randomBytes(4).toString('hex'),
        trim: true
    },
    projectId: {
        type: String,
        required: true,
        ref: 'Project'
    },
    title: {
        type: String,
        required: [true, 'Task title is required.'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    assignedTo: {
        type: String,
        ref: 'User',
        default: null
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Done', 'Cancelled'],
        default: 'To Do',
        trim: true
    },
    priority: {
        type: String,
        enum: ['Urgent', 'High', 'Medium', 'low'],
        default: 'Medium',
        trim: true
    },
    startDate: {
        type: Date
    },
    dueDate: {
        type: Date,
        validate: {
            validator: function (value) {
                if (!this.startDate || !value) {
                    return true;
                }
                return value > this.startDate;
            },
            message: 'Due date must be after the start date.'
        }
    },
    feedback: {
        type: String,
        trim: true
    }
}, { timestamps: true }); // timestamps adds createdAt and updatedAt automatically

// Add indexes for fields that will be frequently queried
taskSchema.index({ projectId: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ dueDate: 1 });

// Clean up JSON output to match your project schema's settings
taskSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    }
});

const Task = mongoose.model("Task", taskSchema);
export default Task;