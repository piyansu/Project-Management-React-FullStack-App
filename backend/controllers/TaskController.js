import Task from '../models/Task.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

// Middleware to check if the user is a member of the project
const checkProjectMembership = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        if (!project.members.includes(req.user._id.toString())) {
            return res.status(403).json({ message: 'You are not a member of this project.' });
        }

        // Store project and isAdmin status in request for later use
        req.project = project;
        req.isAdmin = project.admins.includes(req.user._id.toString());
        next();
    } catch (error) {
        console.error('Error in project membership check:', error);
        res.status(500).json({ message: 'Server error during authorization.' });
    }
};

// @desc    Create a new task within a project
// @route   POST /api/projects/:projectId/tasks
const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, status, priority, startDate, dueDate } = req.body;
        const { projectId } = req.params;

        if (!req.isAdmin) {
            return res.status(403).json({ message: 'Only project admins can create tasks.' });
        }

        if (!title) {
            return res.status(400).json({ message: 'Task title is required.' });
        }

        if (assignedTo) {
            const assignedUser = await User.findById(assignedTo);
            if (!assignedUser) {
                return res.status(404).json({ message: 'Assigned user not found.' });
            }
            if (!req.project.members.includes(assignedTo.toString())) { //
                return res.status(400).json({ message: 'Assigned user is not a member of this project.' });
            }
        }

        const task = new Task({
            projectId,
            title,
            description,
            assignedTo,
            status,
            priority,
            startDate,
            dueDate
        });

        const createdTask = await task.save();
        res.status(201).json(createdTask);

    } catch (error) {
        console.error('Error creating task:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error while creating task.' });
    }
};

// @desc    Get all tasks for a specific project
// @route   GET /api/projects/:projectId/tasks
const getTasksForProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user._id.toString();

        // Base query to filter by project
        const query = { projectId: projectId };

        // If the user is not an admin, they can only see tasks assigned to them.
        if (!req.isAdmin) {
            query.assignedTo = userId;
        }

        const tasks = await Task.find(query).sort({ createdAt: -1 });
        res.status(200).json(tasks);
        
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Server error while fetching tasks.' });
    }
};

// @desc    Get a single task by its ID
// @route   GET /api/projects/:projectId/tasks/:taskId
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);

        if (!task || task.projectId.toString() !== req.params.projectId) {
            return res.status(404).json({ message: 'Task not found in this project.' });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error('Error fetching task by ID:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};


// @desc    Update a task
// @route   PUT /api/projects/:projectId/tasks/:taskId
const updateTask = async (req, res) => {
    try {
        // Only project admins or the assigned user can update a task
        const task = await Task.findById(req.params.taskId);

        if (!task || task.projectId.toString() !== req.params.projectId) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        const isAssigned = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();

        if (!req.isAdmin && !isAssigned) {
            return res.status(403).json({ message: 'Only project admins or the assigned user can update this task.' });
        }

        // Update fields
        Object.assign(task, req.body);

        const updatedTask = await task.save();
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error.' });
    }
};


// @desc    Delete a task
// @route   DELETE /api/projects/:projectId/tasks/:taskId
const deleteTask = async (req, res) => {
    try {
        // Only project admins can delete tasks
        if (!req.isAdmin) {
            return res.status(403).json({ message: 'Only project admins can delete tasks.' });
        }

        const task = await Task.findById(req.params.taskId);

        if (!task || task.projectId.toString() !== req.params.projectId) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        await task.deleteOne();
        res.status(200).json({ message: 'Task deleted successfully.' });

    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};


export {
    checkProjectMembership,
    createTask,
    getTasksForProject,
    getTaskById,
    updateTask,
    deleteTask
};