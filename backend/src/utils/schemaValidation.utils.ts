import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters long')
        .max(50, 'Name must be at most 50 characters long')
        .trim(),

    email: z.string()
        .email('Invalid email format')
        .trim()
        .toLowerCase(),

    password: z.string()
        .min(8, 'Password must be at least 8 characters long')
        .max(128, 'Password must be at most 128 characters long')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        )
});


export const loginSchema = z.object({
    email: z.string()
        .email('Invalid email format')
        .trim()
        .toLowerCase(),

    password: z.string()
        .min(1, 'Password is required')
});


export const forgotPasswordSchema = z.object({
    email: z.string()
        .email('Invalid email format')
        .trim()
        .toLowerCase()
});


export const resetPasswordSchema = z.object({
    token: z.string()
        .min(1, 'Token is required'),

    password: z.string()
        .min(8, 'Password must be at least 8 characters long')
        .max(128, 'Password must be at most 128 characters long')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        )
});


export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
