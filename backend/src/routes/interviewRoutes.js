const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);
router.use(roleMiddleware(['CANDIDATE']));

/**
 * @swagger
 * tags:
 *   name: Interviews
 *   description: Mock AI interview sessions
 *
 * /api/interviews/start:
 *   post:
 *     summary: Start a new mock interview session
 *     tags: [Interviews]
 *
 * /api/interviews/my-interviews:
 *   get:
 *     summary: Get all my past interview sessions
 *     tags: [Interviews]
 *
 * /api/interviews/{id}:
 *   put:
 *     summary: Submit answers or update an interview session
 *     tags: [Interviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   delete:
 *     summary: Delete an interview session
 *     tags: [Interviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */

router.post('/start', interviewController.startInterview);
router.get('/my-interviews', interviewController.getMyInterviews);
router.put('/:id', interviewController.updateInterview);
router.delete('/:id', interviewController.deleteInterview);

module.exports = router;
