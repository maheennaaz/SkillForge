const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
});

async function simulate() {
    const subjectId = 1;
    const userId = 1;
    try {
        console.log('Querying quiz stats with DISTINCT...');
        const [quizStats] = await pool.query(
            `SELECT 
                COUNT(DISTINCT q.id) as total_quizzes,
                COUNT(DISTINCT qr.quiz_id) as passed_quizzes
             FROM quizzes q
             JOIN sections sec ON q.section_id = sec.id
             LEFT JOIN quiz_results qr ON q.id = qr.quiz_id AND qr.user_id = ? AND qr.passed = true
             WHERE sec.subject_id = ?`,
            [userId, subjectId]
        );
        console.log('Quiz stats:', quizStats[0]);
        process.exit(0);
    } catch (error) {
        console.error('SIMULATION ERROR:', error);
        process.exit(1);
    }
}

simulate();
