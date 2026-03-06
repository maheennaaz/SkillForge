import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function findDupes() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '16614'),
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false }
    });
    const results: any = {};
    try {
        const [sections]: any = await connection.execute(`
            SELECT subject_id, title, COUNT(*) as count 
            FROM sections 
            GROUP BY subject_id, title 
            HAVING count > 1
        `);
        results.duplicateSections = sections;

        const [videos]: any = await connection.execute(`
            SELECT section_id, title, COUNT(*) as count 
            FROM videos 
            GROUP BY section_id, title 
            HAVING count > 1
        `);
        results.duplicateVideos = videos;

        const [totalSections]: any = await connection.execute('SELECT COUNT(*) as count FROM sections');
        results.totalSections = totalSections[0].count;

        const [totalQuizzes]: any = await connection.execute('SELECT COUNT(*) as count FROM quizzes');
        results.totalQuizzes = totalQuizzes[0].count;

        const fs = require('fs');
        fs.writeFileSync('dupe_results.json', JSON.stringify(results, null, 2));
        console.log('Results written to dupe_results.json');

    } catch (err) {
        console.error('Find Dupes failed:', err);
    } finally {
        await connection.end();
    }
}
findDupes();
