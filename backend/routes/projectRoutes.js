import express from 'express';
import { createProject, getProjects, updateProject, deleteProject, exportProjectSummary } from '../controllers/projectController.js';
import { basicAuth } from '../auth/auth.js'; // Optional: Apply basicAuth for routes that need authentication


const router = express.Router();

router.post('/', basicAuth, createProject);
router.get('/', basicAuth, getProjects);
router.put('/:projectId', basicAuth, updateProject);
router.delete('/:projectId', basicAuth, deleteProject);
router.post('/:projectId/export', basicAuth, exportProjectSummary);

export default router;
