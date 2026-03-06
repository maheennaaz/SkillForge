import { Response } from 'express';
import pool from '../../config/db';
import { AuthRequest } from '../../middleware/authMiddleware';

export const getQuizBySection = async (req: AuthRequest, res: Response) => {
    const { sectionId } = req.params;
    try {
        const [quizzes]: any = await pool.query('SELECT * FROM quizzes WHERE section_id = ?', [sectionId]);
        if (quizzes.length === 0) return res.status(404).json({ error: 'No quiz found for this section' });

        const quiz = quizzes[0];
        const [questions]: any = await pool.query('SELECT id, question_text, option_a, option_b, option_c, option_d FROM quiz_questions WHERE quiz_id = ?', [quiz.id]);

        res.status(200).json({ ...quiz, questions });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const submitQuiz = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const { quizId, answers } = req.body; // answers: { questionId: 'A', ... }

    try {
        const [questions]: any = await pool.query('SELECT id, correct_option, question_text FROM quiz_questions WHERE quiz_id = ?', [quizId]);

        let correctCount = 0;
        const feedback = questions.map((q: any) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correct_option;
            if (isCorrect) correctCount++;
            return {
                questionId: q.id,
                questionText: q.question_text,
                userAnswer,
                correctOption: q.correct_option,
                isCorrect
            };
        });

        const score = Math.round((correctCount / questions.length) * 100);
        const passed = score >= 70;

        await pool.query(
            'INSERT INTO quiz_results (user_id, quiz_id, score, passed) VALUES (?, ?, ?, ?)',
            [userId, quizId, score, passed]
        );

        res.status(200).json({ score, passed, feedback });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
