import { Request, Response, NextFunction } from "express";
import { generateTokens, verifyAccessToken } from "../utils/jwt.utils";
import { IUser, User } from "../model/user.model";
import logger from "../config/logger";
import crypto from "crypto";

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }

        const decoded: any = verifyAccessToken(token);
        if (!decoded) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        const user: IUser | any = await User.findOne({ _id: decoded._id });
        if (!user) {
            return res.json({ message: 'If an account with that email exists, we sent a password reset link.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        // await sendPasswordResetEmail(user.email, resetToken);
        // logger.info(`Password reset requested: ${user.email}`);

        res.json({ message: 'If an account with that email exists, we sent a password reset link.' });
    } catch (error) {
        logger.error('Forgot password error:', error);
        res.status(500).json({ error: 'Password reset request failed' });
    }
};


export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.loginAttempts = 0;
        user.lockUntil = undefined;
        await user.save();

        // Invalidate all existing sessions
        // await redisClient.del(`refresh_token:${user._id}`);

        // logger.info(`Password reset: ${user.email}`);
        res.json({ message: 'Password reset successful' });
    } catch (error) {
        logger.error('Reset password error:', error);
        res.status(500).json({ error: 'Password reset failed' });
    }
};


export const socialAuthSuccess = async (req: any, res: Response) => {
    try {

        const user: any = req.user;
        const tokens = generateTokens({ userId: user._id, role: user.role });

        // Store refresh token in Redis
        // await redisClient.setEx(
        //     `refresh_token:${user._id}`,
        //     7 * 24 * 60 * 60,
        //     tokens.refreshToken
        // );

        // Redirect to frontend with tokens
        const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${tokens.accessToken}&refresh=${tokens.refreshToken}`;
        res.redirect(redirectUrl);
    } catch (error) {
        logger.error('Social auth success error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
};