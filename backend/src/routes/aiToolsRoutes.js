const express = require('express');
const router = express.Router();
const aiToolsController = require('../controllers/aiToolsController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);
router.use(roleMiddleware(['CANDIDATE']));

/**
 * @swagger
 * tags:
 *   name: AI Tools
 *   description: AI-powered resume, match, cover letter, and branding tools
 *
 * /api/ai-tools/score-cv:
 *   post:
 *     summary: Generate a new CV score report
 *     tags: [AI Tools]
 *
 * /api/ai-tools/score-reports:
 *   get:
 *     summary: Get all previous CV score reports
 *     tags: [AI Tools]
 *
 * /api/ai-tools/score-reports/{id}:
 *   delete:
 *     summary: Delete a CV score report
 *     tags: [AI Tools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 * /api/ai-tools/match-job:
 *   post:
 *     summary: Generate a new job-CV match report
 *     tags: [AI Tools]
 *
 * /api/ai-tools/match-reports:
 *   get:
 *     summary: Get all previous job match reports
 *     tags: [AI Tools]
 *
 * /api/ai-tools/match-reports/{id}:
 *   delete:
 *     summary: Delete a job match report
 *     tags: [AI Tools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 * /api/ai-tools/cover-letter:
 *   post:
 *     summary: Generate a new cover letter
 *     tags: [AI Tools]
 *
 * /api/ai-tools/cover-letters:
 *   get:
 *     summary: Get all previous cover letters
 *     tags: [AI Tools]
 *
 * /api/ai-tools/cover-letters/{id}:
 *   delete:
 *     summary: Delete a cover letter
 *     tags: [AI Tools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 * /api/ai-tools/branding:
 *   post:
 *     summary: Generate a personal branding profile (headlines & bios)
 *     tags: [AI Tools]
 */

// Generate (POST)
router.post('/score-cv', aiToolsController.generateScoreReport);
router.post('/match-job', aiToolsController.generateMatchReport);
router.post('/cover-letter', aiToolsController.generateCoverLetter);
router.post('/branding', aiToolsController.generateBrandingProfile);

// History (GET)
router.get('/score-reports', aiToolsController.getScoreReports);
router.get('/match-reports', aiToolsController.getMatchReports);
router.get('/cover-letters', aiToolsController.getCoverLetters);

// Delete (DELETE)
router.delete('/score-reports/:id', aiToolsController.deleteScoreReport);
router.delete('/match-reports/:id', aiToolsController.deleteMatchReport);
router.delete('/cover-letters/:id', aiToolsController.deleteCoverLetter);

module.exports = router;
