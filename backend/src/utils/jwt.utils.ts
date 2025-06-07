import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';

export const generateTokens = (payload: any) => {
    const accessToken = jwt.sign(
        payload,
        process.env.JWT_SECRET!,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
        logger.error('Access token verification failed:', error);
        return null;
    }
};

export const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
    } catch (error) {
        logger.error('Refresh token verification failed:', error);
        return null;
    }
};