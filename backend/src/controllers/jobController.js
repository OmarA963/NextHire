const db = require('../config/db');

exports.createJob = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { title, description, required_skills, salary_min, salary_max, currency, job_type, location, deadline } = req.body;
    const skillsJson = required_skills ? JSON.stringify(required_skills) : null;

    // Get employer_id
    const empResult = await db.query('SELECT employer_id FROM Employers WHERE user_id = $1', [userId]);
    if (empResult.rows.length === 0) {
      return res.status(403).json({ message: 'Employer profile required to post a job.' });
    }
    const employerId = empResult.rows[0].employer_id;

    const newJob = await db.query(
      `INSERT INTO JobPosts (employer_id, title, description, required_skills, salary_min, salary_max, currency, job_type, location, deadline) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [employerId, title, description, skillsJson, salary_min, salary_max, currency || 'EGP', job_type, location, deadline]
    );

    res.status(201).json({ message: 'Job created successfully', job: newJob.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.getJobs = async (req, res, next) => {
  try {
    const jobs = await db.query(
      `SELECT j.*, e.company_name, e.logo_url 
       FROM JobPosts j 
       JOIN Employers e ON j.employer_id = e.employer_id 
       WHERE j.is_active = true 
       ORDER BY j.created_at DESC`
    );
    res.json(jobs.rows);
  } catch (err) {
    next(err);
  }
};

exports.getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await db.query(
      `SELECT j.*, e.company_name, e.logo_url, e.description as employer_description 
       FROM JobPosts j 
       JOIN Employers e ON j.employer_id = e.employer_id 
       WHERE j.job_id = $1`, [id]
    );

    if (job.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { id } = req.params;
    const { title, description, required_skills, salary_min, salary_max, currency, job_type, location, deadline, is_active } = req.body;
    const skillsJson = required_skills ? JSON.stringify(required_skills) : null;

    // Verify employer owns the job
    const empResult = await db.query('SELECT employer_id FROM Employers WHERE user_id = $1', [userId]);
    if (empResult.rows.length === 0) return res.status(403).json({ message: 'Employer profile required.' });
    const employerId = empResult.rows[0].employer_id;

    const updatedJob = await db.query(
      `UPDATE JobPosts 
       SET title = COALESCE($1, title), description = COALESCE($2, description), 
           required_skills = COALESCE($3, required_skills), salary_min = COALESCE($4, salary_min), 
           salary_max = COALESCE($5, salary_max), currency = COALESCE($6, currency), 
           job_type = COALESCE($7, job_type), location = COALESCE($8, location), 
           deadline = COALESCE($9, deadline), is_active = COALESCE($10, is_active), 
           updated_at = NOW()
       WHERE job_id = $11 AND employer_id = $12 RETURNING *`,
      [title, description, skillsJson, salary_min, salary_max, currency, job_type, location, deadline, is_active, id, employerId]
    );

    if (updatedJob.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }
    res.json({ message: 'Job updated successfully', job: updatedJob.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    // Ensure the employer deleting the job owns it
    const employerCheck = await db.query('SELECT employer_id FROM Employers WHERE user_id = $1', [userId]);
    if (employerCheck.rows.length === 0) return res.status(403).json({ message: 'Employer profile required.' });
    const employerId = employerCheck.rows[0].employer_id;

    const result = await db.query('DELETE FROM JobPosts WHERE job_id = $1 AND employer_id = $2 RETURNING *', [id, employerId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ============================================
// Saved Jobs (Neural Bookmarks)
// ============================================

exports.saveJob = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { id: jobId } = req.params;

    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) return res.status(403).json({ message: 'Only candidates can save jobs' });
    const candidateId = candResult.rows[0].candidate_id;

    const saved = await db.query(
      `INSERT INTO SavedJobs (candidate_id, job_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *`,
      [candidateId, jobId]
    );

    res.status(201).json({ message: 'Job saved successfully', saved: saved.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.unsaveJob = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { id: jobId } = req.params;

    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) return res.status(403).json({ message: 'Only candidates can unsave jobs' });
    const candidateId = candResult.rows[0].candidate_id;

    await db.query(
      `DELETE FROM SavedJobs WHERE candidate_id = $1 AND job_id = $2`,
      [candidateId, jobId]
    );

    res.json({ message: 'Job removed from saved list' });
  } catch (err) {
    next(err);
  }
};

exports.getSavedJobs = async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) return res.status(403).json({ message: 'Only candidates can view saved jobs' });
    const candidateId = candResult.rows[0].candidate_id;

    const result = await db.query(
      `SELECT jp.* FROM JobPosts jp 
       INNER JOIN SavedJobs sj ON jp.job_id = sj.job_id 
       WHERE sj.candidate_id = $1 ORDER BY sj.created_at DESC`,
      [candidateId]
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.getEmployerJobs = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const empResult = await db.query('SELECT employer_id FROM Employers WHERE user_id = $1', [userId]);
    if (empResult.rows.length === 0) return res.status(403).json({ message: 'Employer profile not found' });
    const employerId = empResult.rows[0].employer_id;

    const jobs = await db.query(
      `SELECT j.*, (SELECT COUNT(*) FROM JobApplications a WHERE a.job_id = j.job_id) as applicant_count 
       FROM JobPosts j WHERE j.employer_id = $1 ORDER BY j.created_at DESC`, [employerId]
    );

    res.json(jobs.rows);
  } catch (err) { next(err); }
};
