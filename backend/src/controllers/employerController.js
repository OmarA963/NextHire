const db = require('../config/db');

exports.createOrUpdateProfile = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { company_name, industry, website_url, logo_url, description } = req.body;

    const existing = await db.query('SELECT employer_id FROM Employers WHERE user_id = $1', [userId]);

    if (existing.rows.length > 0) {
      const updated = await db.query(
        `UPDATE Employers 
         SET company_name = $1, industry = $2, website_url = $3, logo_url = $4, description = $5 
         WHERE user_id = $6 RETURNING *`,
        [company_name, industry, website_url, logo_url, description, userId]
      );
      return res.json({ message: 'Employer profile updated', profile: updated.rows[0] });
    } else {
      const newProfile = await db.query(
        `INSERT INTO Employers (user_id, company_name, industry, website_url, logo_url, description) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [userId, company_name, industry, website_url, logo_url, description]
      );
      return res.status(201).json({ message: 'Employer profile created', profile: newProfile.rows[0] });
    }
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const profile = await db.query(
      `SELECT e.*, u.name, u.email 
       FROM Employers e 
       JOIN Users u ON e.user_id = u.user_id 
       WHERE e.user_id = $1`, [userId]
    );

    if (profile.rows.length === 0) {
      return res.status(404).json({ message: 'Employer profile not found' });
    }

    res.json(profile.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.deleteProfile = async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    // Deleting User cascades to Employer
    const result = await db.query(
      `DELETE FROM Users WHERE user_id = $1 RETURNING *`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ message: 'Employer profile and user account deleted successfully' });
  } catch (err) {
    next(err);
  }
};
