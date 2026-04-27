const db = require('./src/config/db');
const bcrypt = require('bcrypt');

async function forceCreateUser() {
    const email = 'oooo@gmail.com';
    const pass = '12345678';
    const name = 'Test User';
    
    try {
        console.log("Starting force user creation...");
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(pass, salt);
        
        await db.query('DELETE FROM Users WHERE LOWER(email) = $1', [email.toLowerCase()]);
        
        const userRes = await db.query(
            'INSERT INTO Users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING user_id',
            [name, email.toLowerCase(), hash, 'CANDIDATE']
        );
        
        const userId = userRes.rows[0].user_id;
        await db.query('INSERT INTO Candidates (user_id) VALUES ($1)', [userId]);
        
        console.log(`✅ USER CREATED: ${email} | PASS: ${pass}`);
        process.exit(0);
    } catch (err) {
        console.error("❌ FAILED:", err);
        process.exit(1);
    }
}

forceCreateUser();
