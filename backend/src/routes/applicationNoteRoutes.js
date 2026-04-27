const express = require('express');
const router = express.Router();
const noteController = require('../controllers/applicationNoteController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Application Notes
 *   description: Manage application notes
 * /api/applications/{id}/notes:
 *   post:
 *     summary: Add a note to an application
 *     tags: [Application Notes]
 *   get:
 *     summary: Get all notes for an application
 *     tags: [Application Notes]
 * /api/applications/notes/{note_id}:
 *   put:
 *     summary: Update a note
 *     tags: [Application Notes]
 *   delete:
 *     summary: Delete a note
 *     tags: [Application Notes]
 */

router.post('/:id/notes', authMiddleware, roleMiddleware(['EMPLOYER', 'ADMIN']), noteController.addNote);
router.get('/:id/notes', authMiddleware, roleMiddleware(['EMPLOYER', 'ADMIN']), noteController.getNotes);
router.put('/notes/:note_id', authMiddleware, roleMiddleware(['EMPLOYER', 'ADMIN']), noteController.updateNote);
router.delete('/notes/:note_id', authMiddleware, roleMiddleware(['EMPLOYER', 'ADMIN']), noteController.deleteNote);

module.exports = router;
