import { Request, Response } from 'express';
import pool from '../../config/db';
import { AuthRequest } from '../../middleware/authMiddleware';

export const getVideoById = async (req: AuthRequest, res: Response) => {
    const { videoId } = req.params;
    const userId = req.user?.userId;

    try {
        const [rows]: any = await pool.query(
            `SELECT v.*, s.title as section_title, sub.id as subject_id, sub.title as subject_title 
             FROM videos v 
             JOIN sections s ON v.section_id = s.id 
             JOIN subjects sub ON s.subject_id = sub.id 
             WHERE v.id = ?`,
            [videoId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Video not found' });
        }

        const video = rows[0];

        // Prerequisite check
        if (video.prerequisite_video_id) {
            const [progress]: any = await pool.query(
                'SELECT is_completed FROM video_progress WHERE user_id = ? AND video_id = ?',
                [userId, video.prerequisite_video_id]
            );

            if (!progress[0]?.is_completed) {
                return res.status(403).json({
                    locked: true,
                    unlock_reason: 'Prerequisite video not completed',
                    prerequisite_video_id: video.prerequisite_video_id
                });
            }
        }

        res.status(200).json({ ...video, locked: false });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
