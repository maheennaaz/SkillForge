const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function diagnose() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT || '3306')
    });

    try {
        console.log('Testing query for user ID 1...');
        const userId = 1;
        const query = `SELECT 
                s.*,
                (SELECT COUNT(DISTINCT v.id) FROM videos v JOIN sections sec ON v.section_id = sec.id WHERE sec.subject_id = s.id) as total_videos,
                (SELECT COUNT(DISTINCT vp.video_id) FROM video_progress vp JOIN videos v ON vp.video_id = v.id JOIN sections sec ON v.section_id = sec.id WHERE sec.subject_id = s.id AND vp.user_id = ? AND vp.is_completed = true) as completed_videos,
                (SELECT COUNT(DISTINCT q.id) FROM quizzes q JOIN sections sec ON q.section_id = sec.id WHERE sec.subject_id = s.id) as total_quizzes,
                (SELECT COUNT(DISTINCT qr.quiz_id) FROM quiz_results qr JOIN quizzes q ON qr.quiz_id = q.id JOIN sections sec ON q.section_id = sec.id WHERE sec.subject_id = s.id AND qr.user_id = ? AND qr.passed = true) as passed_quizzes,
                (
                    SELECT v2.id 
                    FROM videos v2 
                    JOIN sections sec2 ON v2.section_id = sec2.id 
                    LEFT JOIN video_progress vp2 ON v2.id = vp2.video_id AND vp2.user_id = ?
                    WHERE sec2.subject_id = s.id 
                    ORDER BY vp2.is_completed ASC, sec2.order_index ASC, v2.order_index ASC 
                    LIMIT 1
                ) as next_video_id
             FROM subjects s
             JOIN enrollments e ON s.id = e.subject_id
             WHERE e.user_id = ?`;

        const [rows] = await pool.query(query, [userId, userId, userId, userId]);
        console.log('SUCCESS! Rows found:', rows.length);
        console.log('Sample row:', JSON.stringify(rows[0], null, 2));
    } catch (err) {
        console.error('QUERY FAILED:', err.message);
        console.error('ERROR CODE:', err.code);
    } finally {
        await pool.end();
    }
}

diagnose();
