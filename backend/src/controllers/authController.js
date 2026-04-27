const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const logger = require('../config/logger');
const emailQueue = require('../jobs/emailQueue');

// 5. Business Logic - Authentication
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const rawPassword = String(password);

    // Check if user exists
    const userCheck = await db.query('SELECT user_id FROM Users WHERE LOWER(email) = $1', [cleanEmail]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already registered.' });
    }

    // 9. Security - Password Hashing
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(rawPassword, salt);

    // Insert user
    const newUser = await db.query(
      'INSERT INTO Users (name, email, password_hash, role, face_descriptor) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, name, email, role',
      [cleanName, cleanEmail, password_hash, role || 'CANDIDATE', req.body.face_descriptor ? JSON.stringify(req.body.face_descriptor) : null]
    );

    const user = newUser.rows[0];
    logger.info(`User registered successfully: ${cleanEmail} (ID: ${user.user_id})`);

    // ─── Auto-create Profile based on role ────────────────────────────
    if (user.role === 'CANDIDATE') {
      await db.query('INSERT INTO Candidates (user_id) VALUES ($1)', [user.user_id]);
    } else if (user.role === 'EMPLOYER') {
      await db.query('INSERT INTO Employers (user_id, company_name) VALUES ($1, $2)', [user.user_id, name]);
    }

    // 8. Background Jobs - Send Welcome Email asynchronously
    emailQueue.add({
      to: cleanEmail,
      subject: 'Welcome to NextHire!',
      body: `Hi ${cleanName}, welcome to our platform.`
    });

    res.status(201).json({ message: 'User registered successfully.', user });
  } catch (error) {
    logger.error(`Registration error for ${req.body?.email}: ${error.message}`);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || password === undefined || password === null) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const rawPassword = String(password);

    const userResult = await db.query('SELECT * FROM Users WHERE LOWER(email) = $1', [cleanEmail]);
    const user = userResult.rows[0];

    if (!user || !(await bcrypt.compare(rawPassword, user.password_hash))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 4. Authentication - Generate JWT
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
