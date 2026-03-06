import pool from './src/config/db';

async function updateDataAnalytics() {
    const daUpdates = [
        { id: 1, url: 'https://www.youtube.com/watch?v=V1Lv73xdZuk' }, // What is Data Analytic
        { id: 2, url: 'https://www.youtube.com/watch?v=3jyOh3J4K3A' }, // Importance of Data
        { id: 3, url: 'https://www.youtube.com/watch?v=eiQO6A8lqXM' }, // Types of Data Analytics
        { id: 4, url: 'https://www.youtube.com/watch?v=lgCNTuLBMK4' }, // Analytics Lifecycle
        { id: 5, url: 'https://www.youtube.com/watch?v=yZvFH7B6gKI' }, // Roles in Data
        { id: 6, url: 'https://www.youtube.com/watch?v=Ndcgo2ZA2Cg' }, // Tools for Data Analytics
        { id: 7, url: 'https://www.youtube.com/watch?v=r-uOLxNrNk8' }, // Python Basics
        { id: 8, url: 'https://www.youtube.com/watch?v=r-uOLxNrNk8' }, // Variables and Data Types
        { id: 9, url: 'https://www.youtube.com/watch?v=r-uOLxNrNk8' }, // Control Statements
        { id: 10, url: 'https://www.youtube.com/watch?v=r-uOLxNrNk8' }, // Functions
        { id: 11, url: 'https://www.youtube.com/watch?v=GPVsHOlRBBI' }, // Working with Libraries
        { id: 12, url: 'https://www.youtube.com/watch?v=GPVsHOlRBBI' }, // Python Practice
        { id: 13, url: 'https://www.youtube.com/watch?v=GPVsHOlRBBI' }, // Introduction to Pandas
        { id: 14, url: 'https://www.youtube.com/watch?v=GPVsHOlRBBI' }, // Series and DataFrames
        { id: 15, url: 'https://www.youtube.com/watch?v=GPVsHOlRBBI' }, // Reading Data Files
        { id: 16, url: 'https://www.youtube.com/watch?v=tPovtPiZ9cY' }, // Cleaning Data
        { id: 17, url: 'https://www.youtube.com/watch?v=tPovtPiZ9cY' }, // Filtering Data
        { id: 18, url: 'https://www.youtube.com/watch?v=tPovtPiZ9cY' }, // Pandas Case Study
        { id: 19, url: 'https://www.youtube.com/watch?v=LL1PGVOFziE' }, // Visualization Basics
        { id: 20, url: 'https://www.youtube.com/watch?v=wB9C0Mz9gSo' }, // Matplotlib Introduction
        { id: 21, url: 'https://www.youtube.com/watch?v=R11kqj992Ms' }, // Seaborn Charts
        { id: 22, url: 'https://www.youtube.com/watch?v=Bjz00ygERxY' }, // Distribution Plots
        { id: 23, url: 'https://www.youtube.com/watch?v=J7cd1-g1O7A' }, // Correlation Heatmaps
        { id: 24, url: 'https://www.youtube.com/watch?v=OOLlVlleaN4' }  // Visualization Project
    ];

    try {
        console.log('Updating Data Analytics Course YouTube links...');
        for (const update of daUpdates) {
            await pool.query('UPDATE videos SET youtube_url = ? WHERE id = ?', [update.url, update.id]);
            console.log(`Updated video ID ${update.id} with ${update.url}`);
        }
        console.log('Data Analytics Course links updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Update failed:', error);
        process.exit(1);
    }
}

updateDataAnalytics();
