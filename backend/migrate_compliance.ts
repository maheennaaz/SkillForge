import pool from './src/config/db';

async function migrate() {
    try {
        console.log('Running migration...');
        await pool.query(`
            ALTER TABLE subjects 
            ADD COLUMN instructor_name VARCHAR(255) DEFAULT 'Elite Mentor', 
            ADD COLUMN learning_objectives JSON;
        `);
        console.log('Migration successful: Added instructor_name and learning_objectives to subjects');

        // Update some specific data
        await pool.query("UPDATE subjects SET instructor_name = 'Dr. Sarah Johnson', learning_objectives = '[\"Master AI fundamentals\", \"Understand Neural Networks\", \"Build real-world ML models\"]' WHERE slug = 'artificial-intelligence';");
        await pool.query("UPDATE subjects SET instructor_name = 'James Wilson', learning_objectives = '[\"Data cleaning in Python\", \"Statistical Analysis\", \"Pandas and NumPy mastery\"]' WHERE slug = 'data-analytics';");
        await pool.query("UPDATE subjects SET instructor_name = 'Robert Forge', learning_objectives = '[\"Java OOP principles\", \"Collections Framework\", \"Multi-threading basics\"]' WHERE slug = 'java-programming';");

        console.log('Data seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
