import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '16614'),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
};

async function diagnose() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        console.log('--- SUBJECTS ---');
        const [subjects]: any = await connection.execute('SELECT id, title FROM subjects');
        console.table(subjects);

        console.log('--- SECTIONS & QUIZZES ---');
        const [data]: any = await connection.execute(`
            SELECT 
                s.title as subject,
                sec.title as section,
                q.id as quiz_id,
                (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = q.id) as questions_count
            FROM subjects s
            JOIN sections sec ON s.id = sec.subject_id
            LEFT JOIN quizzes q ON sec.id = q.section_id
            ORDER BY s.id, sec.order_index
        `);
        console.table(data);

        console.log('--- CART ITEMS ---');
        const [cart]: any = await connection.execute('SELECT user_id, subject_id FROM cart_items');
        console.table(cart);

    } catch (err) {
        console.error(err);
    } finally {
        await connection.end();
    }
}
diagnose();
