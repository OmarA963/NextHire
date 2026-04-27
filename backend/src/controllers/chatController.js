const db = require('../config/db');

exports.startChatSession = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { page_context } = req.body;

    const messages = JSON.stringify([
      { role: "system", content: "Hello, I am NextHire AI. How can I help you today?", timestamp: new Date() }
    ]);

    const chat = await db.query(
      `INSERT INTO ChatHistories (user_id, messages, page_context) 
       VALUES ($1, $2, $3) RETURNING *`,
      [userId, messages, page_context || null]
    );

    res.status(201).json(chat.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.getMyChats = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const chats = await db.query(
      `SELECT * FROM ChatHistories WHERE user_id = $1 ORDER BY session_start DESC`,
      [userId]
    );
    res.json(chats.rows);
  } catch (err) {
    next(err);
  }
};

exports.appendMessage = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { id } = req.params;
    const { role, content } = req.body;

    // Fetch existing chat
    const existing = await db.query(
      `SELECT * FROM ChatHistories WHERE chat_id = $1 AND user_id = $2`,
      [id, userId]
    );
    if (existing.rows.length === 0) return res.status(404).json({ message: 'Chat session not found or unauthorized' });

    const existingMessages = JSON.parse(existing.rows[0].messages);
    existingMessages.push({ role, content, timestamp: new Date() });

    const updated = await db.query(
      `UPDATE ChatHistories SET messages = $1 WHERE chat_id = $2 AND user_id = $3 RETURNING *`,
      [JSON.stringify(existingMessages), id, userId]
    );

    res.json({ message: 'Message appended', chat: updated.rows[0] });
  } catch (err) { next(err); }
};

exports.deleteChat = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { id } = req.params;

    const result = await db.query(
      `DELETE FROM ChatHistories WHERE chat_id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Chat session not found or unauthorized' });
    res.json({ message: 'Chat session deleted successfully' });
  } catch (err) { next(err); }
};

