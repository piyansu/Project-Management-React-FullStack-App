import express from 'express';
import {
    createProject,
    getUserProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addProjectMember,
    removeProjectMember
} from '../controllers/ProjectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Routes for /projects
router.route('/')
    .post(createProject)
    .get(getUserProjects);

// Routes for /projects/:id
router.route('/:id')
    .get(getProjectById)
    .put(updateProject)
    .delete(deleteProject);

// Route for adding a member
// POST /projects/:id/members
router.post('/:id/members', addProjectMember);

// Route for removing a member
// DELETE /projects/:id/members/:memberId
router.delete('/:id/members/:memberId', removeProjectMember);


export default router;