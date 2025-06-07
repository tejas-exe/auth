import app from "./app";
import dotenv from "dotenv";
import { redisConnection } from "./config/redis";
import { connectDB } from "./config/db";
import logger from "./config/logger";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        await redisConnection();

        app.listen(PORT, () => {
            console.log(`🚀 Server listening on port ${PORT}`);
            logger.info(`🚀 Server listening on port ${PORT}`);
        });
    } catch (error: any) {
        console.error("Failed to start server:", error);
        logger.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
