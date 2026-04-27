const db = require('./src/config/db');
const bcrypt = require('bcrypt');

async function resetPassword() {
    const email = 'omarmohamedpepo1@gmail.com';
    const newPass = '123456';
    
    try {
        console.log(`Resetting password for ${email}...`);
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPass, salt);
        
        const res = await db.query(
            'UPDATE Users SET password_hash = $1 WHERE email = $2 RETURNING *',
            [hash, email]
        );
        
        if (res.rows.length > 0) {
            console.log(`✅ Success! Password for ${email} is now: ${newPass}`);
        } else {
            console.log(`❌ Error: User with email ${email} not found.`);
        }
        process.exit(0);
    } catch (err) {
        console.error("Reset failed:", err);
        process.exit(1);
    }
}

resetPassword();
