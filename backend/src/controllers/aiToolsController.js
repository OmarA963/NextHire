const db = require('../config/db');

// Mock generation functions for AI tools (in a real app, this would call OpenAI or similar)

exports.generateScoreReport = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { cv_id } = req.body;

    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    const candidateId = candResult.rows[0].candidate_id;

    // AI Mock Logic...
    const overall_score = Math.floor(Math.random() * 40) + 60; // 60-100
    const recommendations = JSON.stringify(["Use more action verbs", "Quantify achievements"]);

    const report = await db.query(
      `INSERT INTO ScoreReports (candidate_id, cv_id, overall_score, recommendations) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [candidateId, cv_id, overall_score, recommendations]
    );

    res.status(201).json({ message: 'Score generated', report: report.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.generateMatchReport = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { job_id, cv_id } = req.body;

    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    const candidateId = candResult.rows[0].candidate_id;

    const match_percentage = Math.floor(Math.random() * 50) + 50;

    const report = await db.query(
      `INSERT INTO MatchReports (candidate_id, job_id, cv_id, match_percentage) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [candidateId, job_id, cv_id, match_percentage]
    );

    res.status(201).json({ message: 'Match report generated', report: report.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.generateCoverLetter = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { job_id, tone } = req.body;

    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    const candidateId = candResult.rows[0].candidate_id;

    const content = "Dear Hiring Manager, I am very excited to apply...";

    const letter = await db.query(
      `INSERT INTO CoverLetters (candidate_id, job_id, content, tone) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [candidateId, job_id, content, tone || 'FORMAL']
    );

    res.status(201).json({ message: 'Cover letter generated', coverLetter: letter.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.generateBrandingProfile = async (req, res, next) => {
  try {
    const { input_text } = req.body;
    
    // In a real app, send input_text to OpenAI. Here we mock it based on frontend templates.
    let detectedRole = "Professional";
    let detectedSkill = "Modern Technology";
    const inputLower = (input_text || "").toLowerCase();

    if (inputLower.includes("engineer") || inputLower.includes("developer")) detectedRole = "Software Engineer";
    if (inputLower.includes("react") || inputLower.includes("frontend")) detectedSkill = "React & Frontend Architecture";
    else if (inputLower.includes("node") || inputLower.includes("backend")) detectedSkill = "Scalable Backend Systems";
    else if (inputLower.includes("design") || inputLower.includes("ui")) detectedSkill = "Intuitive UX/UI Design";

    const results = {
        professional: `Results-oriented ${detectedRole} with a proven track record of delivering high-quality solutions. Expertise in ${detectedSkill} and a passion for optimizing performance.`,
        creative: `Crafting digital experiences as a ${detectedRole}. Turning complex problems into elegant ${detectedSkill} solutions with a dash of creativity.`,
        minimalist: `${detectedRole} | ${detectedSkill} Enthusiast | Builder`,
        headlines: [
            `${detectedRole} | Specializing in ${detectedSkill} | Helping companies build better products`,
            `${detectedRole} passionate about ${detectedSkill} & Innovation`,
            `Building the future of ${detectedSkill} as a ${detectedRole}`
        ]
    };

    res.json(results);
  } catch (err) {
    next(err);
  }
};

// ============================================================
// Score Reports - GET history & DELETE
// ============================================================
exports.getScoreReports = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) return res.status(403).json({ message: 'Candidate profile required.' });
    const candidateId = candResult.rows[0].candidate_id;

    const reports = await db.query(
      `SELECT * FROM ScoreReports WHERE candidate_id = $1 ORDER BY generated_at DESC`,
      [candidateId]
    );
    res.json(reports.rows);
  } catch (err) { next(err); }
};

exports.deleteScoreReport = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { id } = req.params;
    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) return res.status(403).json({ message: 'Candidate profile required.' });
    const candidateId = candResult.rows[0].candidate_id;

    const result = await db.query(
      `DELETE FROM ScoreReports WHERE score_id = $1 AND candidate_id = $2 RETURNING *`,
      [id, candidateId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Score report not found or unauthorized' });
    res.json({ message: 'Score report deleted successfully' });
  } catch (err) { next(err); }
};

// ============================================================
// Match Reports - GET history & DELETE
// ============================================================
exports.getMatchReports = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) return res.status(403).json({ message: 'Candidate profile required.' });
    const candidateId = candResult.rows[0].candidate_id;

    const reports = await db.query(
      `SELECT mr.*, jp.title as job_title FROM MatchReports mr
       LEFT JOIN JobPosts jp ON mr.job_id = jp.job_id
       WHERE mr.candidate_id = $1 ORDER BY mr.generated_at DESC`,
      [candidateId]
    );
    res.json(reports.rows);
  } catch (err) { next(err); }
};

exports.deleteMatchReport = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { id } = req.params;
    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) return res.status(403).json({ message: 'Candidate profile required.' });
    const candidateId = candResult.rows[0].candidate_id;

    const result = await db.query(
      `DELETE FROM MatchReports WHERE report_id = $1 AND candidate_id = $2 RETURNING *`,
      [id, candidateId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Match report not found or unauthorized' });
    res.json({ message: 'Match report deleted successfully' });
  } catch (err) { next(err); }
};

// ============================================================
// Cover Letters - GET history & DELETE
// ============================================================
exports.getCoverLetters = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) return res.status(403).json({ message: 'Candidate profile required.' });
    const candidateId = candResult.rows[0].candidate_id;

    const letters = await db.query(
      `SELECT cl.*, jp.title as job_title FROM CoverLetters cl
       LEFT JOIN JobPosts jp ON cl.job_id = jp.job_id
       WHERE cl.candidate_id = $1 ORDER BY cl.generated_at DESC`,
      [candidateId]
    );
    res.json(letters.rows);
  } catch (err) { next(err); }
};

exports.deleteCoverLetter = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { id } = req.params;
    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) return res.status(403).json({ message: 'Candidate profile required.' });
    const candidateId = candResult.rows[0].candidate_id;

    const result = await db.query(
      `DELETE FROM CoverLetters WHERE letter_id = $1 AND candidate_id = $2 RETURNING *`,
      [id, candidateId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Cover letter not found or unauthorized' });
    res.json({ message: 'Cover letter deleted successfully' });
  } catch (err) { next(err); }
};
