import pool from './src/config/db';

async function updateJava() {
    const javaUpdates = [
        { id: 25, url: 'https://www.youtube.com/watch?v=yRpLlJmRo2w' }, // Introduction to Java
        { id: 26, url: 'https://www.youtube.com/watch?v=GoXwIVyNvX0' }, // Setting up Java Environment
        { id: 27, url: 'https://www.youtube.com/watch?v=TAtrPoaJ7gc' }, // Java Syntax Basics
        { id: 28, url: 'https://www.youtube.com/watch?v=GcsFMrXXGmI' }, // Variables and Data Types
        { id: 29, url: 'https://www.youtube.com/watch?v=GcsFMrXXGmI' }, // Operators in Java
        { id: 30, url: 'https://www.youtube.com/watch?v=eIrMbAQSU34' }, // Java Program Structure
        { id: 31, url: 'https://www.youtube.com/watch?v=YPK6NYMJt_A' }, // If Statements
        { id: 32, url: 'https://www.youtube.com/watch?v=8F3ZQMmlDyQ' }, // Switch Statements
        { id: 33, url: 'https://www.youtube.com/watch?v=1BItOtB8Bsw' }, // Loops in Java
        { id: 34, url: 'https://www.youtube.com/watch?v=ODv_LnF-pww' }, // Break and Continue
        { id: 35, url: 'https://www.youtube.com/watch?v=ODv_LnF-pww' }, // Nested Loops
        { id: 36, url: 'https://www.youtube.com/watch?v=TOytzPoI3Zs' }, // Control Flow Practice
        { id: 37, url: 'https://www.youtube.com/watch?v=UmnCZ7-9yDY' }, // Classes and Objects
        { id: 38, url: 'https://www.youtube.com/watch?v=UmnCZ7-9yDY' }, // Constructors
        { id: 39, url: 'https://www.youtube.com/watch?v=UmnCZ7-9yDY' }, // Inheritance
        { id: 40, url: 'https://www.youtube.com/watch?v=UmnCZ7-9yDY' }, // Polymorphism
        { id: 41, url: 'https://www.youtube.com/watch?v=UmnCZ7-9yDY' }, // Encapsulation
        { id: 42, url: 'https://www.youtube.com/watch?v=UmnCZ7-9yDY' }, // Abstraction
        { id: 43, url: 'https://www.youtube.com/watch?v=A74TOX803D0' }, // Exception Handling
        { id: 44, url: 'https://www.youtube.com/watch?v=A74TOX803D0' }, // Collections Framework
        { id: 45, url: 'https://www.youtube.com/watch?v=A74TOX803D0' }, // File Handling
        { id: 46, url: 'https://www.youtube.com/watch?v=A74TOX803D0' }, // Multithreading
        { id: 47, url: 'https://www.youtube.com/watch?v=A74TOX803D0' }, // Java Streams API
        { id: 48, url: 'https://www.youtube.com/watch?v=xTtL8E4LzTQ' }  // Mini Java Project
    ];

    try {
        console.log('Updating Java Course YouTube links...');
        for (const update of javaUpdates) {
            await pool.query('UPDATE videos SET youtube_url = ? WHERE id = ?', [update.url, update.id]);
            console.log(`Updated video ID ${update.id} with ${update.url}`);
        }
        console.log('Java Course links updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Update failed:', error);
        process.exit(1);
    }
}

updateJava();
