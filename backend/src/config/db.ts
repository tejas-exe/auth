import mongoose from 'mongoose';
import logger from './logger';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI!);
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error('Database connection failed:', error);
        process.exit(1);
    }
};