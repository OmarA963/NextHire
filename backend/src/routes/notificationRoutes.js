const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Notifications]
 * /api/notifications/{notif_id}/read:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 * /api/notifications/{notif_id}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 */

router.get('/', notificationController.getMyNotifications);
router.put('/:notif_id/read', notificationController.markAsRead);
router.delete('/:notif_id', notificationController.deleteNotification);

module.exports = router;
