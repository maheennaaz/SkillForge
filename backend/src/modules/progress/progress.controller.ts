import { Request, Response } from 'express';
import pool from '../../config/db';
import { AuthRequest } from '../../middleware/authMiddleware';

export const updateVideoProgress = async (req: AuthRequest, res: Response) => {
    const { videoId } = req.params;
    const { last_position_seconds, is_completed } = req.body;
    const userId = req.user.userId;

    try {
        await pool.execute(
            `INSERT INTO video_progress (user_id, video_id, last_position_seconds, is_completed, completed_at) 
             VALUES (?, ?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE 
             last_position_seconds = VALUES(last_position_seconds), 
             is_completed = VALUES(is_completed), 
             completed_at = IF(VALUES(is_completed), NOW(), completed_at),
             updated_at = NOW()`,
            [userId, videoId, last_position_seconds, is_completed, is_completed ? new Date() : null]
        );
        res.status(200).json({ message: 'Progress updated' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getVideoProgress = async (req: AuthRequest, res: Response) => {
    const { videoId } = req.params;
    const userId = req.user.userId;

    try {
        const [rows]: any = await pool.execute(
            'SELECT * FROM video_progress WHERE user_id = ? AND video_id = ?',
            [userId, videoId]
        );
        res.status(200).json(rows[0] || { last_position_seconds: 0, is_completed: false });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getSubjectProgress = async (req: AuthRequest, res: Response) => {
    const { subjectId } = req.params;
    const userId = req.user.userId;

    try {
        const [stats]: any = await pool.execute(
            `SELECT 
                COUNT(*) as total_videos,
                SUM(IF(vp.is_completed, 1, 0)) as completed_videos
             FROM videos v
             JOIN sections s ON v.section_id = s.id
             LEFT JOIN video_progress vp ON v.id = vp.video_id AND vp.user_id = ?
             WHERE s.subject_id = ?`,
            [userId, subjectId]
        );

        const total = stats[0].total_videos || 0;
        const completed = stats[0].completed_videos || 0;
        const percent = total > 0 ? (completed / total) * 100 : 0;

        res.status(200).json({ total, completed, percent });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
