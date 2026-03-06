import pool from './src/config/db';

async function updateAI() {
    const aiUpdates = [
        { id: 49, url: 'https://www.youtube.com/watch?v=SSE4M0gcmvE' }, // Introduction to AI
        { id: 50, url: 'https://www.youtube.com/watch?v=JMUxmLyrhSk' }, // History of AI
        { id: 51, url: 'https://www.youtube.com/watch?v=4jmsHaJ7xEA' }, // Applications of AI
        { id: 52, url: 'https://www.youtube.com/watch?v=Yq0QkCxoTHM' }, // AI vs ML vs DL
        { id: 53, url: 'https://www.youtube.com/watch?v=nVyD6THcvDQ' }, // AI Ethics
        { id: 54, url: 'https://www.youtube.com/watch?v=ML9AeEYLt0E' }, // Future of AI
        { id: 55, url: 'https://www.youtube.com/watch?v=vStJoetOxJg' }, // What is Machine Learning
        { id: 56, url: 'https://www.youtube.com/watch?v=wvODQqb3D_8' }, // Types of ML (User called it Types of Machine Learning)
        { id: 57, url: 'https://www.youtube.com/watch?v=Mu3POlNoLdc' }, // Supervised Learning
        { id: 58, url: 'https://www.youtube.com/watch?v=aaKUJZqWZ_I' }, // Unsupervised Learning
        { id: 59, url: 'https://www.youtube.com/watch?v=I3ge5DUmsl4' }, // Model Training
        { id: 60, url: 'https://www.youtube.com/watch?v=LcWFedjaR4Q' }, // Model Evaluation
        { id: 61, url: 'https://www.youtube.com/watch?v=Ps0y6w4cD_U' }, // Linear Regression
        { id: 62, url: 'https://www.youtube.com/watch?v=Ps0y6w4cD_U' }, // Logistic Regression
        { id: 63, url: 'https://www.youtube.com/watch?v=Ps0y6w4cD_U' }, // Decision Trees
        { id: 64, url: 'https://www.youtube.com/watch?v=Ps0y6w4cD_U' }, // Random Forest
        { id: 65, url: 'https://www.youtube.com/watch?v=aaKUJZqWZ_I' }, // K-Means Clustering
        { id: 66, url: 'https://www.youtube.com/watch?v=Ps0y6w4cD_U' }, // Naive Bayes
        { id: 67, url: 'https://www.youtube.com/watch?v=0CVsGUQbSec' }, // Introduction to Neural Networks
        { id: 68, url: 'https://www.youtube.com/watch?v=sU4vg-ZufEY' }, // Activation Functions
        { id: 69, url: 'https://www.youtube.com/watch?v=0CVsGUQbSec' }, // CNN Basics
        { id: 70, url: 'https://www.youtube.com/watch?v=0CVsGUQbSec' }, // RNN Basics
        { id: 71, url: 'https://www.youtube.com/watch?v=sU4vg-ZufEY' }, // Training Deep Networks
        { id: 72, url: 'https://www.youtube.com/watch?v=i_LwzRVP7bg' }  // Deep Learning Project
    ];

    try {
        console.log('Updating AI Course YouTube links...');
        for (const update of aiUpdates) {
            await pool.query('UPDATE videos SET youtube_url = ? WHERE id = ?', [update.url, update.id]);
            console.log(`Updated video ID ${update.id} with ${update.url}`);
        }
        console.log('AI Course links updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Update failed:', error);
        process.exit(1);
    }
}

updateAI();
