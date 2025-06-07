import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";
import { User } from "../model/user.model";

export const getProfile = async (req: any, res: Response) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({ user });
    } catch (error) {
        logger.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
};

export const updateProfile = async (req: any, res: Response) => {
    try {
        const { name } = req.body;
        const updates: any = {};

        if (name) updates.name = name;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        logger.info(`Profile updated: ${user.email}`);
        res.json({ user, message: 'Profile updated successfully' });
    } catch (error) {
        logger.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('-password');
        res.json({ users });
    } catch (error) {
        logger.error('Get all users error:', error);
        res.status(500).json({ error: 'Failed to get users' });
    }
};

export const deleteUser = async (req: any, res: Response) => {
    try {
        const { userId } = req.params;

        if (userId === req.user._id.toString()) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        await User.findByIdAndDelete(userId);
        logger.info(`User deleted by admin: ${req.user.email}`);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        logger.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};