const express = require('express');
const router = express.Router();
const employerController = require('../controllers/employerController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);
router.use(roleMiddleware(['EMPLOYER']));

/**
 * @swagger
 * /api/employers/profile:
 *   get:
 *     summary: Get employer profile
 *     tags: [Employers]
 *   post:
 *     summary: Create or update employer profile
 *     tags: [Employers]
 *   delete:
 *     summary: Delete employer profile and account
 *     tags: [Employers]
 */

router.get('/profile', authMiddleware, roleMiddleware(['EMPLOYER']), employerController.getProfile);
router.post('/profile', authMiddleware, roleMiddleware(['EMPLOYER']), employerController.createOrUpdateProfile);
router.delete('/profile', authMiddleware, roleMiddleware(['EMPLOYER']), employerController.deleteProfile);

module.exports = router;
