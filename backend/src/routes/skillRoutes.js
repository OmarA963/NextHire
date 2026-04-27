const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Skills
 *   description: Skill-Up Connector resources
 *
 * /api/skills:
 *   get:
 *     summary: Get all skill resources (supports ?skill_name= filter)
 *     tags: [Skills]
 *   post:
 *     summary: Add a new skill resource (Admin only)
 *     tags: [Skills]
 *
 * /api/skills/{id}:
 *   put:
 *     summary: Update a skill resource (Admin only)
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   delete:
 *     summary: Delete a skill resource (Admin only)
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */

// Public read access
router.get('/', skillController.getSkills);

// Admin-only write access
router.post('/', authMiddleware, roleMiddleware(['ADMIN']), skillController.addSkill);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN']), skillController.updateSkill);
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), skillController.deleteSkill);

module.exports = router;
