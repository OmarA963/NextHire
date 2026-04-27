const db = require('../config/db');

exports.addNote = async (req, res, next) => {
  try {
    const { id: applicationId } = req.params;
    const { content } = req.body;
    const authorId = req.user.user_id;

    const result = await db.query(
      `INSERT INTO ApplicationNotes (application_id, author_id, content) 
       VALUES ($1, $2, $3) RETURNING *`,
      [applicationId, authorId, content]
    );

    res.status(201).json({ message: 'Note added successfully', note: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.getNotes = async (req, res, next) => {
  try {
    const { id: applicationId } = req.params;

    const result = await db.query(
      `SELECT n.*, u.name as author_name FROM ApplicationNotes n
       JOIN Users u ON n.author_id = u.user_id
       WHERE n.application_id = $1 ORDER BY n.created_at DESC`,
      [applicationId]
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    const { note_id } = req.params;
    const { content } = req.body;
    const authorId = req.user.user_id;

    const result = await db.query(
      `UPDATE ApplicationNotes SET content = $1 
       WHERE note_id = $2 AND author_id = $3 RETURNING *`,
      [content, note_id, authorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Note not found or unauthorized' });
    }

    res.json({ message: 'Note updated successfully', note: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const { note_id } = req.params;
    const authorId = req.user.user_id;

    const result = await db.query(
      `DELETE FROM ApplicationNotes WHERE note_id = $1 AND author_id = $2 RETURNING *`,
      [note_id, authorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Note not found or unauthorized' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    next(err);
  }
};
