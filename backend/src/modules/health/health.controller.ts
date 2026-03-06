import { Request, Response } from 'express';
import pool from '../../config/db';

export const getHealth = async (req: Request, res: Response) => {
    try {
        await pool.query('SELECT 1');
        res.status(200).json({ status: 'ok', database: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'error', database: 'disconnected' });
    }
};
