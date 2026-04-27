const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./src/config/db');
const bcrypt = require('bcrypt');

async function auditPasswords() {
    try {
        const res = await db.query('SELECT user_id, email, password_hash FROM Users');
        console.log(`Auditing ${res.rows.length} users...`);

        for (let user of res.rows) {
            const isHashed = user.password_hash && user.password_hash.startsWith('$2');
            console.log(`User: ${user.email} | Hashed: ${isHashed}`);
            
            if (!isHashed) {
                console.log(`⚠️ Warning: User ${user.email} has a plain-text password. Encrypting now...`);
                const salt = await bcrypt.genSalt(10);
                const newHash = await bcrypt.hash(user.password_hash || '1234', salt);
                await db.query('UPDATE Users SET password_hash = $1 WHERE user_id = $2', [newHash, user.user_id]);
                console.log(`✅ Fixed password for ${user.email}`);
            }
        }
        process.exit(0);
    } catch (err) {
        console.error("Audit failed:", err);
        process.exit(1);
    }
}

auditPasswords();
