import pool from './src/config/db';

async function updateLinks() {
    const updates = [
        { id: 4, url: 'https://youtu.be/7-Ho2Fkyyh0' },
        { id: 5, url: 'https://youtu.be/7YMBgPgy_sY' },
        { id: 6, url: 'https://youtu.be/eG-EmWX6El4' },
        { id: 10, url: 'https://youtu.be/WslmhWukJdM' },
        { id: 11, url: 'https://youtu.be/XN_IdC68eA0' },
        { id: 12, url: 'https://youtu.be/KgCgpCIOkIs' },
        { id: 16, url: 'https://youtu.be/bDhvCp3_lYw' },
        { id: 17, url: 'https://youtu.be/kB7FV-ijdqE' },
        { id: 18, url: 'https://youtu.be/KgCgpCIOkIs' },
        { id: 22, url: 'https://youtu.be/0djtjjy12fI' },
        { id: 23, url: 'https://youtu.be/J7cd1-g1O7A' },
        { id: 24, url: 'https://youtu.be/j4xlVLgsmNQ' }
    ];

    try {
        console.log('Updating YouTube links...');
        for (const update of updates) {
            await pool.query('UPDATE videos SET youtube_url = ? WHERE id = ?', [update.url, update.id]);
            console.log(`Updated video ID ${update.id} with ${update.url}`);
        }
        console.log('All links updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Update failed:', error);
        process.exit(1);
    }
}

updateLinks();
