import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error: any) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
