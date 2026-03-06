import { Request, Response } from 'express';
import pool from '../../config/db';
import { hashPassword, comparePassword } from '../../utils/password';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import { ResultSetHeader } from 'mysql2';

export const register = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    try {
        const passwordHash = await hashPassword(password);
        const [result] = await pool.execute(
            'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
            [email, passwordHash, name]
        );
        const userId = (result as ResultSetHeader).insertId;

        const accessToken = generateAccessToken(userId);
        const refreshToken = generateRefreshToken(userId);

        // Store refresh token in DB
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        await pool.execute(
            'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
            [userId, refreshToken, expiresAt]
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.status(201).json({ accessToken, user: { id: userId, email, name } });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const [users]: any = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

        const user = users[0];
        const isMatch = await comparePassword(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        await pool.execute(
            'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
            [user.id, refreshToken, expiresAt]
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ accessToken, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const logout = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
        await pool.execute('UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ?', [refreshToken]);
    }
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out' });
};

export const refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ error: 'Refresh token required' });

    try {
        const [tokens]: any = await pool.execute(
            'SELECT * FROM refresh_tokens WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > NOW()',
            [refreshToken]
        );
        if (tokens.length === 0) return res.status(401).json({ error: 'Invalid or expired refresh token' });

        const userId = tokens[0].user_id;
        const accessToken = generateAccessToken(userId);
        res.status(200).json({ accessToken });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
