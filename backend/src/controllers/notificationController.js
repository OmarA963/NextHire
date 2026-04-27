const db = require('../config/db');

exports.getMyNotifications = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const notifications = await db.query(
      `SELECT * FROM Notifications WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    res.json(notifications.rows);
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { notif_id } = req.params;

    const updated = await db.query(
      `UPDATE Notifications SET is_read = true WHERE notif_id = $1 AND user_id = $2 RETURNING *`,
      [notif_id, userId]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(updated.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { notif_id } = req.params;

    const deleted = await db.query(
      `DELETE FROM Notifications WHERE notif_id = $1 AND user_id = $2 RETURNING notif_id`,
      [notif_id, userId]
    );

    if (deleted.rows.length === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    next(err);
  }
};
