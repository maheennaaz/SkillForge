import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '16614'),
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false }
    });
    try {
        const [rows]: any = await connection.execute(`
            SELECT 
                s.title as course,
                sec.title as section,
                q.id as quiz_id,
                COUNT(qq.id) as question_count
            FROM subjects s
            JOIN sections sec ON s.id = sec.subject_id
            LEFT JOIN quizzes q ON sec.id = q.section_id
            LEFT JOIN quiz_questions qq ON q.id = qq.quiz_id
            GROUP BY s.id, sec.id, q.id
            ORDER BY s.title, sec.order_index
        `);
        const fs = require('fs');
        fs.writeFileSync('quiz_results.json', JSON.stringify(rows, null, 2));
        console.log('Results written to quiz_results.json');
    } catch (err) {
        console.error(err);
    } finally {
        await connection.end();
    }
}
check();
