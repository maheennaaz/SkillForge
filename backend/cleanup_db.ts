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

async function cleanup() {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL for cleanup');

    try {
        // Disable foreign key checks temporarily to wipe tables easily
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

        const tables = [
            'quiz_results',
            'video_progress',
            'cart_items',
            'quiz_questions',
            'quizzes',
            'videos',
            'sections',
            'subjects',
            'enrollments'
        ];

        for (const table of tables) {
            console.log(`Cleaning table ${table}...`);
            await connection.execute(`DELETE FROM ${table}`);
            await connection.execute(`ALTER TABLE ${table} AUTO_INCREMENT = 1`);
        }

        console.log('Adding Unique Constraints...');
        // Ensure only one quiz per section
        try {
            await connection.execute('ALTER TABLE quizzes ADD UNIQUE INDEX idx_section_quiz (section_id)');
        } catch (e) { console.log('Quiz constraint might already exist'); }

        // Ensure unique sections and videos
        try {
            await connection.execute('ALTER TABLE sections ADD UNIQUE INDEX idx_subject_section_title (subject_id, title)');
        } catch (e) { console.log('Section constraint might already exist'); }

        try {
            await connection.execute('ALTER TABLE videos ADD UNIQUE INDEX idx_section_video_title (section_id, title)');
        } catch (e) { console.log('Video constraint might already exist'); }

        await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
        console.log('Database cleanup complete and constraints added!');
    } catch (error: any) {
        console.error('Cleanup failed FATAL ERROR:');
        console.error(error.message);
        if (error.code) console.error('Error Code:', error.code);
        process.exit(1);
    } finally {
        await connection.end();
    }
}

cleanup();
