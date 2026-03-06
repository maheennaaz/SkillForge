import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';

export const generateAccessToken = (userId: string | number) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: string | number) => {
    return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '30d' });
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, REFRESH_SECRET);
};
