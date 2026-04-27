const db = require('../config/db');

exports.startInterview = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { target_role, difficulty } = req.body;

    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    const candidateId = candResult.rows[0].candidate_id;

    const questions = JSON.stringify([
      { text: "Tell me about yourself.", response: null, score: null, feedback: null },
      { text: `Why do you want to be a ${target_role}?`, response: null, score: null, feedback: null },
      { text: "What is your greatest technical strength?", response: null, score: null, feedback: null },
      { text: "Describe a challenging project and how you handled it.", response: null, score: null, feedback: null }
    ]);

    const session = await db.query(
      `INSERT INTO InterviewSessions (candidate_id, target_role, difficulty, questions) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [candidateId, target_role, difficulty || 'MEDIUM', questions]
    );

    res.status(201).json(session.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.getMyInterviews = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) return res.status(403).json({ message: 'Candidate profile required.' });
    const candidateId = candResult.rows[0].candidate_id;

    const sessions = await db.query(
      `SELECT * FROM InterviewSessions WHERE candidate_id = $1 ORDER BY created_at DESC`,
      [candidateId]
    );
    res.json(sessions.rows);
  } catch (err) { next(err); }
};

exports.updateInterview = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { id } = req.params;
    const { questions, overall_score, completed_at } = req.body;

    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) return res.status(403).json({ message: 'Candidate profile required.' });
    const candidateId = candResult.rows[0].candidate_id;

    const result = await db.query(
      `UPDATE InterviewSessions
       SET questions = COALESCE($1, questions),
           overall_score = COALESCE($2, overall_score),
           completed_at = COALESCE($3, completed_at)
       WHERE session_id = $4 AND candidate_id = $5 RETURNING *`,
      [questions ? JSON.stringify(questions) : null, overall_score, completed_at, id, candidateId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Interview session not found or unauthorized' });
    res.json({ message: 'Interview session updated', session: result.rows[0] });
  } catch (err) { next(err); }
};

exports.deleteInterview = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { id } = req.params;

    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) return res.status(403).json({ message: 'Candidate profile required.' });
    const candidateId = candResult.rows[0].candidate_id;

    const result = await db.query(
      `DELETE FROM InterviewSessions WHERE session_id = $1 AND candidate_id = $2 RETURNING *`,
      [id, candidateId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Interview session not found or unauthorized' });
    res.json({ message: 'Interview session deleted successfully' });
  } catch (err) { next(err); }
};

