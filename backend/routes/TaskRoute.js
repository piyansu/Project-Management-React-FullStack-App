import express from 'express';
import {
    checkProjectMembership,
    createTask,
    getTasksForProject,
    getTaskById,
    updateTask,
    deleteTask
} from '../controllers/TaskController.js';
import { protect } from '../middleware/authMiddleware.js';

// Using { mergeParams: true } allows us to access params from the parent router (e.g., :projectId)
const router = express.Router({ mergeParams: true });

// Protect all task routes
router.use(protect);

// Check for project membership for all routes in this file
router.use(checkProjectMembership);


router.route('/')
    .post(createTask)          // Create a new task in the project
    .get(getTasksForProject);  // Get all tasks for the project


router.route('/:taskId')
    .get(getTaskById)          // Get a single task
    .put(updateTask)           // Update a task
    .delete(deleteTask);       // Delete a task


export default router;