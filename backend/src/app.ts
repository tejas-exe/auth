import express from "express";
// Core framework for building web applications and APIs
import cors from "cors";
// Allows cross-origin requests, essential for frontend-backend communication
import cookieParser from "cookie-parser";
// Parses cookies attached to the client request object
import helmet from "helmet";
// Adds various security headers to help protect the app
import rateLimit from "express-rate-limit";
import logger from "./config/logger";



const app = express()
app.use(cors({
    // origin:
    // credentials
}))
app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api", rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        error: 'Too many authentication attempts, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            error: 'Too many authentication attempts, please try again later'
        });
    }
}));

app.use((req, res) => {
    res.status(404).json({ message: "not found" })
})

export default app