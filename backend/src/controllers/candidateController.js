const db = require('../config/db');

exports.createOrUpdateProfile = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { candidate_role, target_role, skills, linkedin_url, summary } = req.body;
    const skillsJson = skills ? JSON.stringify(skills) : null;

    // Check if profile exists
    const existing = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);

    if (existing.rows.length > 0) {
      // Update
      const updated = await db.query(
        `UPDATE Candidates 
         SET candidate_role = $1, target_role = $2, skills = $3, linkedin_url = $4, summary = $5 
         WHERE user_id = $6 RETURNING *`,
        [candidate_role, target_role, skillsJson, linkedin_url, summary, userId]
      );
      return res.json({ message: 'Profile updated successfully', profile: updated.rows[0] });
    } else {
      // Insert
      const newProfile = await db.query(
        `INSERT INTO Candidates (user_id, candidate_role, target_role, skills, linkedin_url, summary) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [userId, candidate_role, target_role, skillsJson, linkedin_url, summary]
      );
      return res.status(201).json({ message: 'Profile created successfully', profile: newProfile.rows[0] });
    }
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const profile = await db.query(
      `SELECT c.*, u.name, u.email 
       FROM Candidates c 
       JOIN Users u ON c.user_id = u.user_id 
       WHERE c.user_id = $1`, [userId]
    );

    if (profile.rows.length === 0) {
      return res.status(404).json({ message: 'Candidate profile not found' });
    }

    res.json(profile.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.deleteProfile = async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    // Because Users table is the parent, and Candidates has ON DELETE CASCADE on user_id,
    // deleting the User will delete the Candidate profile (and all associated data).
    // Let's delete the user completely.
    const result = await db.query(
      `DELETE FROM Users WHERE user_id = $1 RETURNING *`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ message: 'Candidate profile and user account deleted successfully' });
  } catch (err) {
    next(err);
  }
};
