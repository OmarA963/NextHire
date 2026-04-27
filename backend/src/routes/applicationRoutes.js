const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);

/**
 * @swagger
 * /api/applications/apply:
 *   post:
 *     summary: Apply for a job
 *     tags: [Applications]
 * /api/applications/my-applications:
 *   get:
 *     summary: Get candidate applications
 *     tags: [Applications]
 * /api/applications/{id}:
 *   delete:
 *     summary: Delete an application
 *     tags: [Applications]
 * /api/applications/job/{job_id}:
 *   get:
 *     summary: Get applicants for a job (Employer)
 *     tags: [Applications]
 * /api/applications/{id}/status:
 *   put:
 *     summary: Update application status (Employer)
 *     tags: [Applications]
 */

// Candidate routes
router.post('/apply', roleMiddleware(['CANDIDATE']), applicationController.applyForJob);
router.get('/my-applications', roleMiddleware(['CANDIDATE']), applicationController.getMyApplications);
router.delete('/:id', roleMiddleware(['CANDIDATE']), applicationController.deleteApplication);

// Employer routes
router.get('/job/:job_id', roleMiddleware(['EMPLOYER']), applicationController.getJobApplicants);
router.put('/:id/status', roleMiddleware(['EMPLOYER']), applicationController.updateApplicationStatus);

module.exports = router;
