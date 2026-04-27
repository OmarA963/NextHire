const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all jobs
 *     tags: [Jobs]
 *   post:
 *     summary: Create a job
 *     tags: [Jobs]
 * /api/jobs/{id}:
 *   get:
 *     summary: Get job by ID
 *     tags: [Jobs]
 *   put:
 *     summary: Update job
 *     tags: [Jobs]
 *   delete:
 *     summary: Delete job
 *     tags: [Jobs]
 * /api/jobs/{id}/save:
 *   post:
 *     summary: Save a job
 *     tags: [Jobs]
 *   delete:
 *     summary: Unsave a job
 *     tags: [Jobs]
 * /api/jobs/saved:
 *   get:
 *     summary: Get all saved jobs
 *     tags: [Jobs]
 */

// Public routes
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobById);

// Protected routes (Employer only)
router.get('/employer/my-jobs', authMiddleware, roleMiddleware(['EMPLOYER']), jobController.getEmployerJobs);
router.post('/', authMiddleware, roleMiddleware(['EMPLOYER']), jobController.createJob);
router.put('/:id', authMiddleware, roleMiddleware(['EMPLOYER']), jobController.updateJob);
router.delete('/:id', authMiddleware, roleMiddleware(['EMPLOYER']), jobController.deleteJob);

// Protected routes (Candidate only) - Saved Jobs
router.get('/candidate/saved', authMiddleware, roleMiddleware(['CANDIDATE']), jobController.getSavedJobs);
router.post('/:id/save', authMiddleware, roleMiddleware(['CANDIDATE']), jobController.saveJob);
router.delete('/:id/save', authMiddleware, roleMiddleware(['CANDIDATE']), jobController.unsaveJob);

module.exports = router;
