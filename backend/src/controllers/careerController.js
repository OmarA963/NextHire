const db = require('../config/db');

exports.generateRoadmap = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { target_role } = req.body;

    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    const candidateId = candResult.rows[0].candidate_id;

    const phases = JSON.stringify([
      { name: "Fundamentals", skills: ["JS", "HTML"], duration: "2 weeks" },
      { name: "Advanced", skills: ["React", "Node"], duration: "4 weeks" }
    ]);

    const roadmap = await db.query(
      `INSERT INTO CareerRoadmaps (candidate_id, target_role, phases) 
       VALUES ($1, $2, $3) RETURNING *`,
      [candidateId, target_role, phases]
    );

    res.status(201).json(roadmap.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.generatePivotPrediction = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { from_role, to_role } = req.body;

    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    const candidateId = candResult.rows[0].candidate_id;

    const prediction = await db.query(
      `INSERT INTO PivotPredictions (candidate_id, from_role, to_role, probability_pct, timeline_weeks) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [candidateId, from_role, to_role, 75.5, 12]
    );

    res.status(201).json(prediction.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.getMarketPulse = async (req, res, next) => {
  try {
    // Generate realistic looking data for the TalentAI Pulse dashboard
    const pulseData = {
      globalMetrics: {
        activeJobSlots: 145000 + Math.floor(Math.random() * 5000),
        hiringCompanies: 42102 + Math.floor(Math.random() * 100),
        avgGlobalSalary: "$92k"
      },
      liveTicker: [
        { label: "Frontend Dev", surge: "+12%" },
        { label: "AI Engineer", surge: "+45%" },
        { label: "Cybersecurity", surge: "+28%" },
        { label: "Product Manager", surge: "+8%" },
        { label: "Data Scientist", surge: "+22%" },
        { label: "Cloud Architect", surge: "+34%" },
        { label: "UX Designer", surge: "+15%" }
      ],
      sectorTrends: [
        { name: "FinTech", growth: "+18.5%", volume: "High" },
        { name: "HealthTech", growth: "+22.1%", volume: "Medium" },
        { name: "AI & ML", growth: "+54.2%", volume: "Extreme" },
        { name: "Green Energy", growth: "+14.8%", volume: "Growing" },
        { name: "E-Commerce", growth: "+9.2%", volume: "Stable" }
      ],
      insight: "Current data patterns indicate a 12% rise in demand for Hybrid Work roles. Companies are increasingly prioritizing System Architecture over individual tool proficiency.",
      lastSync: new Date().toISOString()
    };

    res.json(pulseData);
  } catch (err) {
    next(err);
  }
};

// ============================================================
// Career Roadmaps - GET, PUT, DELETE
// ============================================================
exports.getMyRoadmaps = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) return res.status(403).json({ message: 'Candidate profile required.' });
    const candidateId = candResult.rows[0].candidate_id;

    const roadmaps = await db.query(
      `SELECT * FROM CareerRoadmaps WHERE candidate_id = $1 ORDER BY generated_at DESC`,
      [candidateId]
    );
    res.json(roadmaps.rows);
  } catch (err) { next(err); }
};

exports.updateRoadmap = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { id } = req.params;
    const { current_phase, phases } = req.body;

    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) return res.status(403).json({ message: 'Candidate profile required.' });
    const candidateId = candResult.rows[0].candidate_id;

    const result = await db.query(
      `UPDATE CareerRoadmaps 
       SET current_phase = COALESCE($1, current_phase),
           phases = COALESCE($2, phases),
           updated_at = NOW()
       WHERE roadmap_id = $3 AND candidate_id = $4 RETURNING *`,
      [current_phase, phases ? JSON.stringify(phases) : null, id, candidateId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Roadmap not found or unauthorized' });
    res.json({ message: 'Roadmap updated', roadmap: result.rows[0] });
  } catch (err) { next(err); }
};

exports.deleteRoadmap = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { id } = req.params;

    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) return res.status(403).json({ message: 'Candidate profile required.' });
    const candidateId = candResult.rows[0].candidate_id;

    const result = await db.query(
      `DELETE FROM CareerRoadmaps WHERE roadmap_id = $1 AND candidate_id = $2 RETURNING *`,
      [id, candidateId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Roadmap not found or unauthorized' });
    res.json({ message: 'Roadmap deleted successfully' });
  } catch (err) { next(err); }
};

// ============================================================
// Pivot Predictions - GET, DELETE
// ============================================================
exports.getMyPivots = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) return res.status(403).json({ message: 'Candidate profile required.' });
    const candidateId = candResult.rows[0].candidate_id;

    const pivots = await db.query(
      `SELECT * FROM PivotPredictions WHERE candidate_id = $1 ORDER BY generated_at DESC`,
      [candidateId]
    );
    res.json(pivots.rows);
  } catch (err) { next(err); }
};

exports.deletePivot = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { id } = req.params;

    const candResult = await db.query('SELECT candidate_id FROM Candidates WHERE user_id = $1', [userId]);
    if (candResult.rows.length === 0) return res.status(403).json({ message: 'Candidate profile required.' });
    const candidateId = candResult.rows[0].candidate_id;

    const result = await db.query(
      `DELETE FROM PivotPredictions WHERE pivot_id = $1 AND candidate_id = $2 RETURNING *`,
      [id, candidateId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Pivot prediction not found or unauthorized' });
    res.json({ message: 'Pivot prediction deleted successfully' });
  } catch (err) { next(err); }
};
