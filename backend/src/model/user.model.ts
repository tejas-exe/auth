import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    email: string;
    password?: string;
    name: string;
    role: 'user' | 'admin';
    isVerified: boolean;
    googleId?: string;
    githubId?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    verificationToken?: string;
    lastLogin?: Date;
    loginAttempts: number;
    lockUntil?: Date;

    comparePassword(candidatePassword: string): Promise<boolean>;
    isLocked(): boolean;
    incLoginAttempts(): Promise<any>;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: function (this: any) {
            return !this.googleId && !this.githubId;
        }
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    googleId: String,
    githubId: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    verificationToken: String,
    lastLogin: Date,
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: Date
}, {
    timestamps: true
});

// Password hashing middleware
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        if (this.password) {
            const salt = await bcrypt.genSalt(12);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        }

    } catch (error: any) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

// Account lock methods
userSchema.methods.isLocked = function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
};

userSchema.methods.incLoginAttempts = async function () {
    if (this.lockUntil && this.lockUntil < Date.now()) {
        this.loginAttempts = 1;
        this.lockUntil = undefined;
    } else {
        this.loginAttempts += 1;
        if (this.loginAttempts >= 5 && !this.isLocked()) {
            this.lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
        }
    }
    return this.save();
};

export const User = mongoose.model('User', userSchema);