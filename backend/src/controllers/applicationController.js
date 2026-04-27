const db = require('../config/db');

exports.applyForJob = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { job_id, cv_id } = req.body;

    // Get candidate_id
    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) {
      return res.status(403).json({ message: 'Candidate profile required to apply.' });
    }
    const candidateId = candResult.rows[0].candidate_id;

    // Check if already applied
    const checkApp = await db.query('SELECT application_id FROM JobApplications WHERE candidate_id = $1 AND job_id = $2', [candidateId, job_id]);
    if (checkApp.rows.length > 0) {
      return res.status(400).json({ message: 'You have already applied for this job.' });
    }

    const application = await db.query(
      `INSERT INTO JobApplications (candidate_id, job_id, cv_id, status) 
       VALUES ($1, $2, $3, 'APPLIED') RETURNING *`,
      [candidateId, job_id, cv_id || null]
    );

    res.status(201).json({ message: 'Applied successfully', application: application.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.getMyApplications = async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) {
      return res.status(403).json({ message: 'Candidate profile required.' });
    }
    const candidateId = candResult.rows[0].candidate_id;

    const apps = await db.query(
      `SELECT a.*, j.title, j.location, e.company_name 
       FROM JobApplications a
       JOIN JobPosts j ON a.job_id = j.job_id
       JOIN Employers e ON j.employer_id = e.employer_id
       WHERE a.candidate_id = $1
       ORDER BY a.applied_at DESC`, [candidateId]
    );

    res.json(apps.rows);
  } catch (err) {
    next(err);
  }
};

// For Employer to see applicants
exports.getJobApplicants = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { job_id } = req.params;

    const empResult = await db.query('SELECT employer_id FROM Employers WHERE user_id = $1', [userId]);
    if (empResult.rows.length === 0) {
      return res.status(403).json({ message: 'Employer profile required.' });
    }
    const employerId = empResult.rows[0].employer_id;

    // Verify job belongs to employer
    const jobCheck = await db.query('SELECT job_id FROM JobPosts WHERE job_id = $1 AND employer_id = $2', [job_id, employerId]);
    if (jobCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Unauthorized to view these applications.' });
    }

    const applicants = await db.query(
      `SELECT a.*, c.candidate_role, c.skills, u.name, u.email 
       FROM JobApplications a
       JOIN Candidates c ON a.candidate_id = c.candidate_id
       JOIN Users u ON c.user_id = u.user_id
       WHERE a.job_id = $1
       ORDER BY a.match_score DESC NULLS LAST`, [job_id]
    );

    res.json(applicants.rows);
  } catch (err) {
    next(err);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { id } = req.params; // application_id
    const { status } = req.body;

    // Verify employer
    const empResult = await db.query('SELECT employer_id FROM Employers WHERE user_id = $1', [userId]);
    if (empResult.rows.length === 0) return res.status(403).json({ message: 'Employer profile required.' });
    const employerId = empResult.rows[0].employer_id;

    // Update status only if the job belongs to this employer
    const updated = await db.query(
      `UPDATE JobApplications a
       SET status = $1, updated_at = NOW()
       FROM JobPosts j
       WHERE a.job_id = j.job_id AND a.application_id = $2 AND j.employer_id = $3
       RETURNING a.*`,
      [status, id, employerId]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ message: 'Application not found or unauthorized' });
    }
    res.json({ message: 'Status updated', application: updated.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.deleteApplication = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { id } = req.params; // application_id

    // Only Candidate can delete their application
    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) return res.status(403).json({ message: 'Candidate profile required.' });
    const candidateId = candResult.rows[0].candidate_id;

    const deleted = await db.query(
      `DELETE FROM JobApplications WHERE application_id = $1 AND candidate_id = $2 RETURNING application_id`,
      [id, candidateId]
    );

    if (deleted.rows.length === 0) {
      return res.status(404).json({ message: 'Application not found or unauthorized' });
    }
    res.json({ message: 'Application deleted successfully' });
  } catch (err) {
    next(err);
  }
};
