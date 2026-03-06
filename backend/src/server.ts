import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Server restart triggered at ${new Date().toISOString()}`);
});
