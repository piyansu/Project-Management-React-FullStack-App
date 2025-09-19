import express from 'express';
import {
    createProject,
    getUserProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addProjectMember,
    removeProjectMember,
    addProjectAdmin,
    removeProjectAdmin
} from '../controllers/ProjectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);


router.route('/')
    .post(createProject)
    .get(getUserProjects);


router.route('/:id')
    .get(getProjectById)
    .put(updateProject)
    .delete(deleteProject);


router.post('/:id/members', addProjectMember);

router.delete('/:id/members/:memberId', removeProjectMember);

router.post('/:id/admins', addProjectAdmin);

router.delete('/:id/admins/:adminId', removeProjectAdmin);

export default router;