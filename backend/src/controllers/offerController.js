const db = require('../config/db');

exports.compareOffers = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { offers } = req.body; // Array of offer objects

    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) return res.status(403).json({ message: 'Candidate profile required.' });
    const candidateId = candResult.rows[0].candidate_id;

    // AI Mock Logic to recommend the best offer based on metrics
    const recommendation = "We recommend taking Offer B due to better long-term equity.";

    const comparison = await db.query(
      `INSERT INTO OfferComparisons (candidate_id, offers, recommendation) 
       VALUES ($1, $2, $3) RETURNING *`,
      [candidateId, JSON.stringify(offers), recommendation]
    );

    res.status(201).json(comparison.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.getMyOffers = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) return res.status(403).json({ message: 'Candidate profile required.' });
    const candidateId = candResult.rows[0].candidate_id;

    const comparisons = await db.query(
      `SELECT * FROM OfferComparisons WHERE candidate_id = $1 ORDER BY created_at DESC`,
      [candidateId]
    );
    res.json(comparisons.rows);
  } catch (err) { next(err); }
};

exports.deleteOffer = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { id } = req.params;
    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) return res.status(403).json({ message: 'Candidate profile required.' });
    const candidateId = candResult.rows[0].candidate_id;

    const result = await db.query(
      `DELETE FROM OfferComparisons WHERE comparison_id = $1 AND candidate_id = $2 RETURNING *`,
      [id, candidateId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Offer comparison not found or unauthorized' });
    res.json({ message: 'Offer comparison deleted successfully' });
  } catch (err) { next(err); }
};

