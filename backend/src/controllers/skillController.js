const db = require('../config/db');

exports.getSkills = async (req, res, next) => {
  try {
    const { skill_name } = req.query;
    let query = 'SELECT * FROM SkillResources';
    const params = [];
    if (skill_name) {
      query += ' WHERE LOWER(skill_name) LIKE $1';
      params.push(`%${skill_name.toLowerCase()}%`);
    }
    query += ' ORDER BY created_at DESC';
    const skills = await db.query(query, params);
    res.json(skills.rows);
  } catch (err) {
    next(err);
  }
};

exports.addSkill = async (req, res, next) => {
  try {
    const { skill_name, resource_title, resource_url, resource_type, platform_name, estimated_hours, is_free } = req.body;
    
    const newSkill = await db.query(
      `INSERT INTO SkillResources (skill_name, resource_title, resource_url, resource_type, platform_name, estimated_hours, is_free)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [skill_name, resource_title, resource_url, resource_type, platform_name, estimated_hours, is_free ?? true]
    );

    res.status(201).json(newSkill.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { skill_name, resource_title, resource_url, resource_type, platform_name, estimated_hours, is_free } = req.body;

    const result = await db.query(
      `UPDATE SkillResources 
       SET skill_name = COALESCE($1, skill_name),
           resource_title = COALESCE($2, resource_title),
           resource_url = COALESCE($3, resource_url),
           resource_type = COALESCE($4, resource_type),
           platform_name = COALESCE($5, platform_name),
           estimated_hours = COALESCE($6, estimated_hours),
           is_free = COALESCE($7, is_free)
       WHERE resource_id = $8 RETURNING *`,
      [skill_name, resource_title, resource_url, resource_type, platform_name, estimated_hours, is_free, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Skill resource not found' });
    res.json({ message: 'Skill resource updated', skill: result.rows[0] });
  } catch (err) { next(err); }
};

exports.deleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `DELETE FROM SkillResources WHERE resource_id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Skill resource not found' });
    res.json({ message: 'Skill resource deleted successfully' });
  } catch (err) { next(err); }
};

