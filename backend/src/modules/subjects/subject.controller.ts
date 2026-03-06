import { Request, Response } from 'express';
import pool from '../../config/db';
import { AuthRequest } from '../../middleware/authMiddleware';

export const getSubjects = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT id, title, slug, description, instructor_name, is_published FROM subjects WHERE is_published = true');
        res.status(200).json(rows);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getSubjectById = async (req: Request, res: Response) => {
    const { subjectId } = req.params;
    try {
        const [rows]: any = await pool.query('SELECT * FROM subjects WHERE id = ?', [subjectId]);
        if (rows.length === 0) return res.status(404).json({ error: 'Subject not found' });
        res.status(200).json(rows[0]);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getSubjectTree = async (req: AuthRequest, res: Response) => {
    const { subjectId } = req.params;
    const user = req.user;
    if (!user || !user.userId) {
        return res.status(401).json({ error: 'Unauthorized: Missing User Session' });
    }
    const userId = user.userId;

    try {
        // 1. Fetch Subject
        const [subjectRows]: any = await pool.query('SELECT * FROM subjects WHERE id = ?', [subjectId]);
        if (subjectRows.length === 0) return res.status(404).json({ error: 'Subject not found' });
        const subject = subjectRows[0];

        // 2. Fetch all Sections
        const [sections]: any = await pool.query(
            'SELECT * FROM sections WHERE subject_id = ? ORDER BY order_index',
            [subjectId]
        );

        // 3. Fetch all Videos for this subject including progress in ONE query
        const [allVideos]: any = await pool.query(
            `SELECT v.*, IF(vp.is_completed, true, false) as is_completed 
             FROM videos v
             JOIN sections s ON v.section_id = s.id
             LEFT JOIN video_progress vp ON v.id = vp.video_id AND vp.user_id = ?
             WHERE s.subject_id = ?
             ORDER BY v.order_index`,
            [userId, subjectId]
        );

        // 4. Group videos into sections
        sections.forEach((section: any) => {
            section.videos = allVideos.filter((v: any) => v.section_id === section.id);
        });

        // 5. Calculate Quick Progress
        const totalVideos = allVideos.length;
        const completedVideos = allVideos.filter((v: any) => v.is_completed).length;

        const [quizStats]: any = await pool.query(
            `SELECT 
                COUNT(DISTINCT q.id) as total_quizzes,
                COUNT(DISTINCT qr.quiz_id) as passed_quizzes
             FROM quizzes q
             JOIN sections sec ON q.section_id = sec.id
             LEFT JOIN quiz_results qr ON q.id = qr.quiz_id AND qr.user_id = ? AND qr.passed = true
             WHERE sec.subject_id = ?`,
            [userId, subjectId]
        );

        const totalQuizzes = Number(quizStats[0]?.total_quizzes || 0);
        const passedQuizzes = Number(quizStats[0]?.passed_quizzes || 0);

        const progress_percent = (totalVideos + totalQuizzes) > 0
            ? Math.round(((completedVideos + passedQuizzes) / (totalVideos + totalQuizzes)) * 100)
            : 0;

        res.status(200).json({ ...subject, sections, progress_percent });
    } catch (error: any) {
        const fs = require('fs');
        const path = require('path');
        const logPath = path.join(process.cwd(), 'debug_api.log');
        const logMsg = `[${new Date().toISOString()}] ERROR in getSubjectTree: ${error.message}\nSTACK: ${error.stack}\n\n`;
        fs.appendFileSync(logPath, logMsg);

        console.error('ERROR in getSubjectTree:', error);
        res.status(500).json({
            error: error.message,
            stack: error.stack,
            type: 'API_CONTROLLER_ERROR'
        });
    }
};

export const getEnrolledSubjects = async (req: AuthRequest, res: Response) => {
    const user = req.user;
    if (!user || !user.userId) {
        return res.status(401).json({ error: 'Unauthorized: No user ID' });
    }
    const userId = user.userId;

    try {
        const [rows]: any = await pool.query(
            `SELECT 
                s.*,
                (SELECT COUNT(DISTINCT v.id) FROM videos v JOIN sections sec ON v.section_id = sec.id WHERE sec.subject_id = s.id) as total_videos,
                (SELECT COUNT(DISTINCT vp.video_id) FROM video_progress vp JOIN videos v ON vp.video_id = v.id JOIN sections sec ON v.section_id = sec.id WHERE sec.subject_id = s.id AND vp.user_id = ? AND vp.is_completed = true) as completed_videos,
                (SELECT COUNT(DISTINCT q.id) FROM quizzes q JOIN sections sec ON q.section_id = sec.id WHERE sec.subject_id = s.id) as total_quizzes,
                (SELECT COUNT(DISTINCT qr.quiz_id) FROM quiz_results qr JOIN quizzes q ON qr.quiz_id = q.id JOIN sections sec ON q.section_id = sec.id WHERE sec.subject_id = s.id AND qr.user_id = ? AND qr.passed = true) as passed_quizzes
             FROM subjects s
             JOIN enrollments e ON s.id = e.subject_id
             WHERE e.user_id = ?`,
            [userId, userId, userId]
        );

        const subjectsWithProgress = rows.map((s: any) => {
            const totalItems = Number(s.total_videos || 0) + Number(s.total_quizzes || 0);
            const completedItems = Number(s.completed_videos || 0) + Number(s.passed_quizzes || 0);
            const progress_percent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
            return {
                ...s,
                progress_percent
            };
        });

        res.status(200).json(subjectsWithProgress);
    } catch (error: any) {
        console.error('ERROR in getEnrolledSubjects:', error);
        res.status(500).json({ error: error.message });
    }
};
