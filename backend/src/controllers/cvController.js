const db = require('../config/db');
const upload = require('../services/upload');

exports.uploadCV = async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) {
      return res.status(403).json({ message: 'Candidate profile required to upload CV.' });
    }
    const candidateId = candResult.rows[0].candidate_id;

    const pdf_url = req.file ? req.file.path : null;
    if (!pdf_url) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const newCv = await db.query(
      `INSERT INTO CVs (candidate_id, pdf_url, is_current) VALUES ($1, $2, true) RETURNING *`,
      [candidateId, pdf_url]
    );

    res.status(201).json({ message: 'CV uploaded successfully', cv: newCv.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.getMyCVs = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) {
      return res.status(403).json({ message: 'Candidate profile required.' });
    }
    const candidateId = candResult.rows[0].candidate_id;

    const cvs = await db.query('SELECT * FROM CVs WHERE candidate_id = $1 ORDER BY created_at DESC', [candidateId]);
    res.json(cvs.rows);
  } catch (err) {
    next(err);
  }
};

exports.deleteCV = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { id } = req.params;

    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) return res.status(403).json({ message: 'Candidate profile required.' });
    const candidateId = candResult.rows[0].candidate_id;

    const deleted = await db.query(
      `DELETE FROM CVs WHERE cv_id = $1 AND candidate_id = $2 RETURNING cv_id`,
      [id, candidateId]
    );

    if (deleted.rows.length === 0) {
      return res.status(404).json({ message: 'CV not found or unauthorized' });
    }

    // Note: In a real app, you should also delete the actual PDF file from the disk/S3 here using fs.unlink

    res.json({ message: 'CV deleted successfully' });
  } catch (err) {
    next(err);
  }
};

exports.saveCVBuilderData = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const formData = req.body; // Expecting the JSON structure from the frontend CV Builder

    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) return res.status(403).json({ message: 'Candidate profile required.' });
    const candidateId = candResult.rows[0].candidate_id;

    // We can extract fields to map to our CVs table JSON columns
    const personal_info = JSON.stringify({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      linkedin: formData.linkedin,
      github: formData.github,
      summary: formData.summary,
      photo: formData.photo ? "Included" : "None" // don't save huge base64 in json ideally, but this is a mock representation
    });

    const experience = JSON.stringify([{ text: formData.experience }]);
    const education = JSON.stringify([{ text: formData.education }]);
    const skills = JSON.stringify(formData.skills ? formData.skills.split(',') : []);
    const projects = JSON.stringify([{ text: formData.projects }]);

    const savedCV = await db.query(
      `INSERT INTO CVs (candidate_id, personal_info, experience, education, skills, projects, is_current) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING cv_id`,
      [candidateId, personal_info, experience, education, skills, projects, true]
    );

    res.status(201).json({ message: 'CV Builder data saved successfully', cv_id: savedCV.rows[0].cv_id });
  } catch (err) {
    next(err);
  }
};

exports.updateCVBuilderData = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { id } = req.params;
    const formData = req.body;

    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) return res.status(403).json({ message: 'Candidate profile required.' });
    const candidateId = candResult.rows[0].candidate_id;

    const personal_info = JSON.stringify({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      linkedin: formData.linkedin,
      github: formData.github,
      summary: formData.summary,
      photo: formData.photo ? "Included" : "None"
    });

    const experience = JSON.stringify([{ text: formData.experience }]);
    const education = JSON.stringify([{ text: formData.education }]);
    const skills = JSON.stringify(formData.skills ? formData.skills.split(',') : []);
    const projects = JSON.stringify([{ text: formData.projects }]);

    const updatedCV = await db.query(
      `UPDATE CVs SET personal_info = $1, experience = $2, education = $3, skills = $4, projects = $5, updated_at = GETUTCDATE()
       WHERE cv_id = $6 AND candidate_id = $7 RETURNING *`,
      [personal_info, experience, education, skills, projects, id, candidateId]
    );

    if (updatedCV.rows.length === 0) {
      return res.status(404).json({ message: 'CV not found or unauthorized' });
    }

    res.json({ message: 'CV updated successfully', cv: updatedCV.rows[0] });
  } catch (err) {
    next(err);
  }
};
