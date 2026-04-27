const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: AI Chat widget sessions
 *
 * /api/chats/start:
 *   post:
 *     summary: Start a new AI chat session
 *     tags: [Chat]
 *
 * /api/chats/my-chats:
 *   get:
 *     summary: Get all my chat sessions
 *     tags: [Chat]
 *
 * /api/chats/{id}:
 *   put:
 *     summary: Append a new message to an existing chat session
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   delete:
 *     summary: Delete a chat session
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */

router.post('/start', chatController.startChatSession);
router.get('/my-chats', chatController.getMyChats);
router.put('/:id', chatController.appendMessage);
router.delete('/:id', chatController.deleteChat);

module.exports = router;
