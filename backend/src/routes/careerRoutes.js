const express = require('express');
const router = express.Router();
const careerController = require('../controllers/careerController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);
router.use(roleMiddleware(['CANDIDATE']));

/**
 * @swagger
 * tags:
 *   name: Career
 *   description: Career roadmaps, pivot predictions, and market pulse
 *
 * /api/career/roadmap:
 *   post:
 *     summary: Generate a new career roadmap
 *     tags: [Career]
 *
 * /api/career/roadmaps:
 *   get:
 *     summary: Get all my career roadmaps
 *     tags: [Career]
 *
 * /api/career/roadmaps/{id}:
 *   put:
 *     summary: Update roadmap progress (current_phase or phases)
 *     tags: [Career]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   delete:
 *     summary: Delete a career roadmap
 *     tags: [Career]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 * /api/career/pivot:
 *   post:
 *     summary: Generate a pivot career prediction
 *     tags: [Career]
 *
 * /api/career/pivots:
 *   get:
 *     summary: Get all my pivot predictions
 *     tags: [Career]
 *
 * /api/career/pivots/{id}:
 *   delete:
 *     summary: Delete a pivot prediction
 *     tags: [Career]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 * /api/career/pulse:
 *   get:
 *     summary: Get global talent market pulse data
 *     tags: [Career]
 */

// Roadmaps
router.post('/roadmap', careerController.generateRoadmap);
router.get('/roadmaps', careerController.getMyRoadmaps);
router.put('/roadmaps/:id', careerController.updateRoadmap);
router.delete('/roadmaps/:id', careerController.deleteRoadmap);

// Pivots
router.post('/pivot', careerController.generatePivotPrediction);
router.get('/pivots', careerController.getMyPivots);
router.delete('/pivots/:id', careerController.deletePivot);

// Market Pulse (public within auth)
router.get('/pulse', careerController.getMarketPulse);

module.exports = router;
