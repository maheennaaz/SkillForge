import { Response } from 'express';
import pool from '../../config/db';
import { AuthRequest } from '../../middleware/authMiddleware';

export const getProfile = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    try {
        const [rows]: any = await pool.query(
            'SELECT id, email, name, dob, gender, skills FROM users WHERE id = ?',
            [userId]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(rows[0]);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    let { name, dob, gender, skills } = req.body;

    // Sanitize: MySQL doesn't like "" for DATE or ENUM
    if (dob === '') dob = null;
    if (gender === '' || gender === 'Select Gender') gender = null;
    if (skills === '') skills = null;

    try {
        await pool.query(
            'UPDATE users SET name = ?, dob = ?, gender = ?, skills = ? WHERE id = ?',
            [name, dob, gender, skills, userId]
        );
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error: any) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: error.message });
    }
};
