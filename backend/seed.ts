import mysql, { ResultSetHeader } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig: mysql.ConnectionOptions = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '16614'),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
};

const courses = [
    {
        title: "Data Analytics",
        slug: "data-analytics",
        sections: [
            {
                title: "Introduction",
                order: 1,
                videos: [
                    { title: "What is Data Analytics", url: "https://www.youtube.com/watch?v=ua-CiDNNj30", order: 1 },
                    { title: "Importance of Data", url: "https://www.youtube.com/watch?v=vmEHCJofslg", order: 2 },
                    { title: "Types of Data Analytics", url: "https://www.youtube.com/watch?v=r-uOLxNrNk8", order: 3 },
                    { title: "Analytics Lifecycle", url: "https://www.youtube.com/watch?v=LHBE6Q9XIzI", order: 4 },
                    { title: "Roles in Data", url: "https://www.youtube.com/watch?v=GPVSHOiRBBI", order: 5 },
                    { title: "Tools for Data Analytics", url: "https://www.youtube.com/watch?v=eWRfhZuZrAc", order: 6 }
                ]
            },
            {
                title: "Python for Data Analytics",
                order: 2,
                videos: [
                    { title: "Python Basics", url: "https://www.youtube.com/watch?v=ua-CiDNNj30", order: 1 },
                    { title: "Variables and Data Types", url: "https://www.youtube.com/watch?v=vmEHCJofslg", order: 2 },
                    { title: "Control Statements", url: "https://www.youtube.com/watch?v=r-uOLxNrNk8", order: 3 },
                    { title: "Functions", url: "https://www.youtube.com/watch?v=LHBE6Q9XIzI", order: 4 },
                    { title: "Working with Libraries", url: "https://www.youtube.com/watch?v=GPVSHOiRBBI", order: 5 },
                    { title: "Python Practice", url: "https://www.youtube.com/watch?v=eWRfhZuZrAc", order: 6 }
                ]
            },
            {
                title: "Pandas",
                order: 3,
                videos: [
                    { title: "Introduction to Pandas", url: "https://www.youtube.com/watch?v=ua-CiDNNj30", order: 1 },
                    { title: "Series and DataFrames", url: "https://www.youtube.com/watch?v=vmEHCJofslg", order: 2 },
                    { title: "Reading Data Files", url: "https://www.youtube.com/watch?v=r-uOLxNrNk8", order: 3 },
                    { title: "Cleaning Data", url: "https://www.youtube.com/watch?v=LHBE6Q9XIzI", order: 4 },
                    { title: "Filtering Data", url: "https://www.youtube.com/watch?v=GPVSHOiRBBI", order: 5 },
                    { title: "Pandas Case Study", url: "https://www.youtube.com/watch?v=eWRfhZuZrAc", order: 6 }
                ]
            },
            {
                title: "Data Visualization",
                order: 4,
                videos: [
                    { title: "Visualization Basics", url: "https://www.youtube.com/watch?v=ua-CiDNNj30", order: 1 },
                    { title: "Matplotlib Introduction", url: "https://www.youtube.com/watch?v=vmEHCJofslg", order: 2 },
                    { title: "Seaborn Charts", url: "https://www.youtube.com/watch?v=r-uOLxNrNk8", order: 3 },
                    { title: "Distribution Plots", url: "https://www.youtube.com/watch?v=LHBE6Q9XIzI", order: 4 },
                    { title: "Correlation Heatmaps", url: "https://www.youtube.com/watch?v=GPVSHOiRBBI", order: 5 },
                    { title: "Visualization Project", url: "https://www.youtube.com/watch?v=eWRfhZuZrAc", order: 6 }
                ]
            }
        ]
    },
    {
        title: "Java Programming",
        slug: "java-programming",
        sections: [
            {
                title: "Java Fundamentals",
                order: 1,
                videos: [
                    { title: "Introduction to Java", url: "https://www.youtube.com/watch?v=ua-CiDNNj30", order: 1 },
                    { title: "Setting up Java Environment", url: "https://www.youtube.com/watch?v=vmEHCJofslg", order: 2 },
                    { title: "Java Syntax Basics", url: "https://www.youtube.com/watch?v=r-uOLxNrNk8", order: 3 },
                    { title: "Variables and Data Types", url: "https://www.youtube.com/watch?v=LHBE6Q9XIzI", order: 4 },
                    { title: "Operators in Java", url: "https://www.youtube.com/watch?v=GPVSHOiRBBI", order: 5 },
                    { title: "Java Program Structure", url: "https://www.youtube.com/watch?v=eWRfhZuZrAc", order: 6 }
                ]
            },
            {
                title: "Control Flow",
                order: 2,
                videos: [
                    { title: "If Statements", url: "https://www.youtube.com/watch?v=ua-CiDNNj30", order: 1 },
                    { title: "Switch Statements", url: "https://www.youtube.com/watch?v=vmEHCJofslg", order: 2 },
                    { title: "Loops in Java", url: "https://www.youtube.com/watch?v=r-uOLxNrNk8", order: 3 },
                    { title: "Break and Continue", url: "https://www.youtube.com/watch?v=LHBE6Q9XIzI", order: 4 },
                    { title: "Nested Loops", url: "https://www.youtube.com/watch?v=GPVSHOiRBBI", order: 5 },
                    { title: "Control Flow Practice", url: "https://www.youtube.com/watch?v=eWRfhZuZrAc", order: 6 }
                ]
            },
            {
                title: "Object Oriented Programming",
                order: 3,
                videos: [
                    { title: "Classes and Objects", url: "https://www.youtube.com/watch?v=ua-CiDNNj30", order: 1 },
                    { title: "Constructors", url: "https://www.youtube.com/watch?v=vmEHCJofslg", order: 2 },
                    { title: "Inheritance", url: "https://www.youtube.com/watch?v=r-uOLxNrNk8", order: 3 },
                    { title: "Polymorphism", url: "https://www.youtube.com/watch?v=LHBE6Q9XIzI", order: 4 },
                    { title: "Encapsulation", url: "https://www.youtube.com/watch?v=GPVSHOiRBBI", order: 5 },
                    { title: "Abstraction", url: "https://www.youtube.com/watch?v=eWRfhZuZrAc", order: 6 }
                ]
            },
            {
                title: "Advanced Java",
                order: 4,
                videos: [
                    { title: "Exception Handling", url: "https://www.youtube.com/watch?v=ua-CiDNNj30", order: 1 },
                    { title: "Collections Framework", url: "https://www.youtube.com/watch?v=vmEHCJofslg", order: 2 },
                    { title: "File Handling", url: "https://www.youtube.com/watch?v=r-uOLxNrNk8", order: 3 },
                    { title: "Multithreading", url: "https://www.youtube.com/watch?v=LHBE6Q9XIzI", order: 4 },
                    { title: "Java Streams API", url: "https://www.youtube.com/watch?v=GPVSHOiRBBI", order: 5 },
                    { title: "Mini Java Project", url: "https://www.youtube.com/watch?v=eWRfhZuZrAc", order: 6 }
                ]
            }
        ]
    },
    {
        title: "Artificial Intelligence",
        slug: "artificial-intelligence",
        sections: [
            {
                title: "AI Fundamentals",
                order: 1,
                videos: [
                    { title: "Introduction to Artificial Intelligence", url: "https://www.youtube.com/watch?v=ua-CiDNNj30", order: 1 },
                    { title: "History of AI", url: "https://www.youtube.com/watch?v=vmEHCJofslg", order: 2 },
                    { title: "Applications of AI", url: "https://www.youtube.com/watch?v=r-uOLxNrNk8", order: 3 },
                    { title: "AI vs ML vs DL", url: "https://www.youtube.com/watch?v=LHBE6Q9XIzI", order: 4 },
                    { title: "AI Ethics", url: "https://www.youtube.com/watch?v=GPVSHOiRBBI", order: 5 },
                    { title: "Future of AI", url: "https://www.youtube.com/watch?v=eWRfhZuZrAc", order: 6 }
                ]
            },
            {
                title: "Machine Learning",
                order: 2,
                videos: [
                    { title: "What is Machine Learning", url: "https://www.youtube.com/watch?v=ua-CiDNNj30", order: 1 },
                    { title: "Types of ML", url: "https://www.youtube.com/watch?v=vmEHCJofslg", order: 2 },
                    { title: "Supervised Learning", url: "https://www.youtube.com/watch?v=r-uOLxNrNk8", order: 3 },
                    { title: "Unsupervised Learning", url: "https://www.youtube.com/watch?v=LHBE6Q9XIzI", order: 4 },
                    { title: "Model Training", url: "https://www.youtube.com/watch?v=GPVSHOiRBBI", order: 5 },
                    { title: "Model Evaluation", url: "https://www.youtube.com/watch?v=eWRfhZuZrAc", order: 6 }
                ]
            },
            {
                title: "ML Algorithms",
                order: 3,
                videos: [
                    { title: "Linear Regression", url: "https://www.youtube.com/watch?v=ua-CiDNNj30", order: 1 },
                    { title: "Logistic Regression", url: "https://www.youtube.com/watch?v=vmEHCJofslg", order: 2 },
                    { title: "Decision Trees", url: "https://www.youtube.com/watch?v=r-uOLxNrNk8", order: 3 },
                    { title: "Random Forest", url: "https://www.youtube.com/watch?v=LHBE6Q9XIzI", order: 4 },
                    { title: "K-Means Clustering", url: "https://www.youtube.com/watch?v=GPVSHOiRBBI", order: 5 },
                    { title: "Naive Bayes", url: "https://www.youtube.com/watch?v=eWRfhZuZrAc", order: 6 }
                ]
            },
            {
                title: "Deep Learning",
                order: 4,
                videos: [
                    { title: "Introduction to Neural Networks", url: "https://www.youtube.com/watch?v=ua-CiDNNj30", order: 1 },
                    { title: "Activation Functions", url: "https://www.youtube.com/watch?v=vmEHCJofslg", order: 2 },
                    { title: "CNN Basics", url: "https://www.youtube.com/watch?v=r-uOLxNrNk8", order: 3 },
                    { title: "RNN Basics", url: "https://www.youtube.com/watch?v=LHBE6Q9XIzI", order: 4 },
                    { title: "Training Deep Networks", url: "https://www.youtube.com/watch?v=GPVSHOiRBBI", order: 5 },
                    { title: "Deep Learning Project", url: "https://www.youtube.com/watch?v=eWRfhZuZrAc", order: 6 }
                ]
            }
        ]
    }
];
async function seed() {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL');

    try {
        for (const course of courses) {
            const [subjectResult]: any = await connection.execute(
                'INSERT INTO subjects (title, slug, description, is_published) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE title=VALUES(title)',
                [course.title, course.slug, `Master ${course.title} with this comprehensive course.`, true]
            );

            // Get subject Id even if it existed
            const [subjRows]: any = await connection.execute('SELECT id FROM subjects WHERE slug = ?', [course.slug]);
            const subjectId = subjRows[0].id;

            for (const section of course.sections) {
                const [sectionResult]: any = await connection.execute(
                    'INSERT INTO sections (subject_id, title, order_index) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE title=VALUES(title)',
                    [subjectId, section.title, section.order]
                );

                // Get section Id
                const [secRows]: any = await connection.execute('SELECT id FROM sections WHERE subject_id = ? AND title = ?', [subjectId, section.title]);
                const sectionId = secRows[0].id;

                for (const video of section.videos) {
                    await connection.execute(
                        'INSERT INTO videos (section_id, title, youtube_url, order_index) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE youtube_url=VALUES(youtube_url)',
                        [sectionId, video.title, video.url, video.order]
                    );
                }

                // Clear existing quiz and questions for this section to ensure fresh seed
                const [existingQuizzes]: any = await connection.execute('SELECT id FROM quizzes WHERE section_id = ?', [sectionId]);
                for (const q of existingQuizzes) {
                    await connection.execute('DELETE FROM quiz_questions WHERE quiz_id = ?', [q.id]);
                }
                await connection.execute('DELETE FROM quizzes WHERE section_id = ?', [sectionId]);

                const [qRow]: any = await connection.execute(
                    'INSERT INTO quizzes (section_id, title) VALUES (?, ?)',
                    [sectionId, `${section.title} Assessment`]
                );
                const quizId = qRow.insertId;

                let questionPool: { q: string, a: string, b: string, c: string, d: string, correct: string }[] = [];
                const sectionTitle = section.title.toLowerCase();

                if (course.slug === 'data-analytics') {
                    if (sectionTitle.includes('introduction')) {
                        questionPool = [
                            { q: 'What is the primary goal of Data Analytics?', a: 'Writing web apps', b: 'Building hardware', c: 'Discovering insights from data', d: 'Graphic design', correct: 'C' },
                            { q: 'Which role typically builds data pipelines?', a: 'Data Scientist', b: 'Data Engineer', c: 'Project Manager', d: 'UX Designer', correct: 'B' },
                            { q: 'What type of analytics predicts future outcomes?', a: 'Descriptive', b: 'Diagnostic', c: 'Predictive', d: 'Prescriptive', correct: 'C' },
                            { q: 'Which is a common tool for BI?', a: 'Tableau', b: 'Notepad', c: 'Calculator', d: 'PowerPoint', correct: 'A' },
                            { q: 'What is the first step in the analytics lifecycle?', a: 'Modeling', b: 'Deployment', c: 'Problem Discovery', d: 'Cleaning', correct: 'C' }
                        ];
                    } else if (sectionTitle.includes('python')) {
                        questionPool = [
                            { q: 'Which keyword is used to define a function in Python?', a: 'func', b: 'define', c: 'def', d: 'function', correct: 'C' },
                            { q: 'What is the correct way to start a for loop?', a: 'for x in y:', b: 'for (x=0;x<10;x++)', c: 'foreach x in y', d: 'loop x to y', correct: 'A' },
                            { q: 'Which data type is immutable?', a: 'List', b: 'Dictionary', c: 'Tuple', d: 'Set', correct: 'C' },
                            { q: 'How do you add an element to a list?', a: 'add()', b: 'append()', c: 'insert_end()', d: 'plus()', correct: 'B' },
                            { q: 'What is used for comments in Python?', a: '//', b: '/*', c: '#', d: '--', correct: 'C' }
                        ];
                    } else if (sectionTitle.includes('pandas')) {
                        questionPool = [
                            { q: 'What is the primary data structure for 2D data in Pandas?', a: 'Series', b: 'Array', c: 'DataFrame', d: 'Matrix', correct: 'C' },
                            { q: 'How do you read a CSV file?', a: 'pd.open_csv()', b: 'pd.read_csv()', c: 'pd.get_csv()', d: 'pd.load()', correct: 'B' },
                            { q: 'Which method handles missing values by filling them?', a: 'dropna()', b: 'fillna()', c: 'replace()', d: 'fix()', correct: 'B' },
                            { q: 'How do you see the first 5 rows of a DataFrame?', a: 'df.first()', b: 'df.top()', c: 'df.head()', d: 'df.show()', correct: 'C' },
                            { q: 'Which method is used for grouping data?', a: 'df.group()', b: 'df.groupby()', c: 'df.arrange()', d: 'df.pivot()', correct: 'B' }
                        ];
                    } else if (sectionTitle.includes('visualization')) {
                        questionPool = [
                            { q: 'Which library is the foundation for plotting in Python?', a: 'Pandas', b: 'Matplotlib', c: 'Seaborn', d: 'Plotly', correct: 'B' },
                            { q: 'Which Seaborn function shows correlations?', a: 'lineplot()', b: 'barplot()', c: 'heatmap()', d: 'histplot()', correct: 'C' },
                            { q: 'What does a Box Plot represent?', a: 'Time series', b: 'Distribution and outliers', c: 'Frequency', d: 'Geography', correct: 'B' },
                            { q: 'How do you add a title in Matplotlib?', a: 'plt.name()', b: 'plt.header()', c: 'plt.title()', d: 'plt.label()', correct: 'C' },
                            { q: 'Which plot is best for showing relationships between two numeric variables?', a: 'Pie chart', b: 'Bar chart', c: 'Scatter plot', d: 'Histogram', correct: 'C' }
                        ];
                    }
                } else if (course.slug === 'java-programming') {
                    if (sectionTitle.includes('fundamentals')) {
                        questionPool = [
                            { q: 'What is the extension of a compiled Java file?', a: '.java', b: '.class', c: '.exe', d: '.jar', correct: 'B' },
                            { q: 'Which of these is a primitive data type?', a: 'String', b: 'Integer', c: 'int', d: 'Double', correct: 'C' },
                            { q: 'What is JRE?', a: 'Java Real Environment', b: 'Java Runtime Environment', c: 'Java Run Engine', d: 'Java Rapid Entry', correct: 'B' },
                            { q: 'How do you define a constant in Java?', a: 'const', b: 'static', c: 'final', d: 'immutable', correct: 'C' },
                            { q: 'What is the default value of a boolean?', a: 'true', b: 'false', c: 'null', d: '0', correct: 'B' }
                        ];
                    } else if (sectionTitle.includes('control flow')) {
                        questionPool = [
                            { q: 'Which loop is guaranteed to execute at least once?', a: 'for', b: 'while', c: 'do-while', d: 'foreach', correct: 'C' },
                            { q: 'What does the break statement do?', a: 'Starts a loop', b: 'Exits the loop', c: 'Skips current iteration', d: 'Pause execution', correct: 'B' },
                            { q: 'Which statement is used for multiple branch selection?', a: 'if-else', b: 'switch', c: 'goto', d: 'select', correct: 'B' },
                            { q: 'What is the result of 5 % 2?', a: '2', b: '2.5', c: '1', d: '0', correct: 'C' },
                            { q: 'How do you write "not equal" in Java?', a: '<>', b: '!=', c: '==!', d: '~=', correct: 'B' }
                        ];
                    } else if (sectionTitle.includes('oriented')) {
                        questionPool = [
                            { q: 'Which principle hides internal details?', a: 'Inheritance', b: 'Polymorphism', c: 'Encapsulation', d: 'Abstraction', correct: 'C' },
                            { q: 'What is a constructor used for?', a: 'Deleting objects', b: 'Initializing objects', c: 'Inheriting classes', d: 'Defining methods', correct: 'B' },
                            { q: 'Which keyword refers to the current class object?', a: 'super', b: 'this', c: 'base', d: 'object', correct: 'B' },
                            { q: 'Can a class inherit multiple classes in Java?', a: 'Yes', b: 'No', c: 'Only 2', d: 'Depends on version', correct: 'B' },
                            { q: 'What is Method Overloading?', a: 'Same name, different params', b: 'Same name, same params', c: 'Changing return type only', d: 'Deleting a method', correct: 'A' }
                        ];
                    } else if (sectionTitle.includes('advanced')) {
                        questionPool = [
                            { q: 'Which block always executes in try-catch?', a: 'try', b: 'catch', c: 'finally', d: 'throw', correct: 'C' },
                            { q: 'Which class is the root of the Collection hierarchy?', a: 'List', b: 'Set', c: 'Collection', d: 'Map', correct: 'C' },
                            { q: 'How do you start a thread in Java?', a: 'thread.run()', b: 'thread.start()', c: 'thread.begin()', d: 'thread.execute()', correct: 'B' },
                            { q: 'Which interface allows a collection of unique elements?', a: 'List', b: 'Queue', c: 'Set', d: 'Stack', correct: 'C' },
                            { q: 'What does the Synchronized keyword prevent?', a: 'Speed', b: 'Thread interference', c: 'Memory leaks', d: 'Syntax errors', correct: 'B' }
                        ];
                    }
                } else if (course.slug === 'artificial-intelligence') {
                    if (sectionTitle.includes('fundamentals')) {
                        questionPool = [
                            { q: 'What is the main goal of AI?', a: 'Better screens', b: 'Simulating human intelligence', c: 'Fast internet', d: 'Social media', correct: 'B' },
                            { q: 'Who is known as the father of AI?', a: 'Elon Musk', b: 'Bill Gates', c: 'John McCarthy', d: 'Ada Lovelace', correct: 'C' },
                            { q: 'What is the Turing Test used for?', a: 'Speed', b: 'Intelligence verification', c: 'Memory check', d: 'Screen resolution', correct: 'B' },
                            { q: 'Which is an application of AI?', a: 'Face recognition', b: 'Printing Paper', c: 'Saving files', d: 'Charging phones', correct: 'A' },
                            { q: 'What is Weak AI?', a: 'Broken AI', b: 'Simple AI', c: 'Narrow AI designed for one task', d: 'AI without power', correct: 'C' }
                        ];
                    } else if (sectionTitle.includes('machine learning')) {
                        questionPool = [
                            { q: 'What is Supervised Learning?', a: 'No labels', b: 'Guided by humans', c: 'Learning with labeled data', d: 'Reading books', correct: 'C' },
                            { q: 'Which is an example of Unsupervised Learning?', a: 'Classification', b: 'Regression', c: 'Clustering', d: 'Prediction', correct: 'C' },
                            { q: 'What is Overfitting?', a: 'Fitting perfectly', b: 'Model fits noise instead of pattern', c: 'Model is too small', d: 'Model is too fast', correct: 'B' },
                            { q: 'What is an "Epoch"?', a: 'Time', b: 'One pass over the full dataset', c: 'An error', d: 'A small dataset', correct: 'B' },
                            { q: 'Which is used to evaluate a regression model?', a: 'Accuracy', b: 'Confusion Matrix', c: 'Mean Squared Error', d: 'F1 Score', correct: 'C' }
                        ];
                    } else if (sectionTitle.includes('algorithm')) {
                        questionPool = [
                            { q: 'Which algorithm is used for binary classification?', a: 'Linear Regression', b: 'Logistic Regression', c: 'K-Means', d: 'QuickSort', correct: 'B' },
                            { q: 'Which algorithm uses a tree-like structure?', a: 'Decision Tree', b: 'Neural Network', c: 'SVM', d: 'Naive Bayes', correct: 'A' },
                            { q: 'What does K represent in K-Means?', a: 'Knowledge', b: 'Key', c: 'Number of clusters', d: 'Kilobytes', correct: 'C' },
                            { q: 'Which algorithm is based on Bayes Theorem?', a: 'Random Forest', b: 'Naive Bayes', c: 'Perceptron', d: 'Gradient Descent', correct: 'B' },
                            { q: 'What is the goal of PCA?', a: 'Adding features', b: 'Dimensionality reduction', c: 'Encryption', d: 'Database backup', correct: 'B' }
                        ];
                    } else if (sectionTitle.includes('deep learning')) {
                        questionPool = [
                            { q: 'What is the fundamental unit of a Neural Network?', a: 'Bit', b: 'Node/Neuron', c: 'Block', d: 'Gate', correct: 'B' },
                            { q: 'What does CNN stand for?', a: 'Central Neural Network', b: 'Convolutional Neural Network', c: 'Code Neural Node', d: 'Compressed Neural Net', correct: 'B' },
                            { q: 'Which activation function outputs values between 0 and 1?', a: 'ReLU', b: 'Sigmoid', c: 'Tanh', d: 'Softmax', correct: 'B' },
                            { q: 'What is Backpropagation?', a: 'Moving forward', b: 'Updating weights based on error', c: 'Deleting layers', d: 'Printing results', correct: 'B' },
                            { q: 'Which network is best for sequential data like text?', a: 'CNN', b: 'RNN', c: 'Perceptron', d: 'Decision Tree', correct: 'B' }
                        ];
                    }
                }

                if (questionPool.length === 0) {
                    questionPool = [
                        { q: 'Standard question 1?', a: 'A', b: 'B', c: 'C', d: 'D', correct: 'B' },
                        { q: 'Standard question 2?', a: 'A', b: 'B', c: 'C', d: 'D', correct: 'C' }
                    ];
                }

                for (const q of questionPool) {
                    await connection.execute(
                        `INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [quizId, q.q, q.a, q.b, q.c, q.d, q.correct]
                    );
                }
                console.log(`Successfully seeded quiz for section ID ${sectionId} with ${questionPool.length} questions.`);
            }
        }
        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await connection.end();
    }
}

seed();
