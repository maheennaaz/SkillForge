import { Response } from 'express';
import pool from '../../config/db';
import { AuthRequest } from '../../middleware/authMiddleware';

export const getCart = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    try {
        const [rows]: any = await pool.query(
            `SELECT c.id as cart_id, s.* FROM cart_items c
             JOIN subjects s ON c.subject_id = s.id
             WHERE c.user_id = ?`,
            [userId]
        );
        res.status(200).json(rows);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const { subjectId } = req.body;
    try {
        await pool.query(
            'INSERT INTO cart_items (user_id, subject_id) VALUES (?, ?)',
            [userId, subjectId]
        );
        res.status(201).json({ message: 'Added to cart' });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Item already in cart' });
        }
        res.status(500).json({ error: error.message });
    }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const { subjectId } = req.params;
    try {
        await pool.query(
            'DELETE FROM cart_items WHERE user_id = ? AND subject_id = ?',
            [userId, subjectId]
        );
        res.status(200).json({ message: 'Removed from cart' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
