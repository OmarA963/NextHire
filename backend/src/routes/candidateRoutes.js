const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);
router.use(roleMiddleware(['CANDIDATE']));

/**
 * @swagger
 * /api/candidates/profile:
 *   get:
 *     summary: Get candidate profile
 *     tags: [Candidates]
 *   post:
 *     summary: Create or update candidate profile
 *     tags: [Candidates]
 *   delete:
 *     summary: Delete candidate profile and account
 *     tags: [Candidates]
 */

router.get('/profile', authMiddleware, roleMiddleware(['CANDIDATE']), candidateController.getProfile);
router.post('/profile', authMiddleware, roleMiddleware(['CANDIDATE']), candidateController.createOrUpdateProfile);
router.delete('/profile', authMiddleware, roleMiddleware(['CANDIDATE']), candidateController.deleteProfile);

module.exports = router;
