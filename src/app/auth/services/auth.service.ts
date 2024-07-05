import { user } from '@prisma/client';
import { hashPassword, verifyPassword } from "@/app/utils/auth/password";
import { createSession, deleteSession } from "@/app/utils/auth/session";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/app/utils/email";
import { generateToken } from "@/app/utils/auth/token";
import prisma from "../../../../utils/primsa";
import {Logger} from "winston";


export class AuthService {

    async signup(email: string, password: string): Promise<user> {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('Email already in use');
        }

        const hashedPassword = await hashPassword(password);
        const verificationCode = this.generateVerificationCode();
        const verificationCodeExpiry = new Date(Date.now() + 120000); // 2 minutes from now

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                verificationCode,
                verificationCodeExpiry,
                emailVerified: false,
            },
        });

        await this.sendVerificationEmail(email, verificationCode);

        return user;
    }

    async login(email: string, password: string): Promise<string> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await verifyPassword(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        if (!user.emailVerified) {
            throw new Error('Please verify your email before logging in');
        }

        const sessionToken = await createSession(user.id);
        Logger
        console.log(`User ${user.id} has logged in successfully`)

        return sessionToken;
    }

    async logout(token: string): Promise<void> {
        await deleteSession(token);
    }

    async verifyEmail(email: string, code: string): Promise<string> {
        const user = await prisma.user.findFirst({
            where: {
                email: email,
                verificationCode: code,
                verificationCodeExpiry: { gt: new Date() }
            }
        });
        if (!user) {
            throw new Error('Invalid or expired verification code');
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verificationCode: null,
                verificationCodeExpiry: null
            },
        });

        // Create a new session for the verified user
        const sessionToken = await createSession(user.id);
        return sessionToken;
    }

    async resendVerificationEmail(email: string): Promise<void> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.emailVerified) {
            // Don't reveal that the email doesn't exist or is already verified
            return;
        }

        const verificationCode = this.generateVerificationCode();
        const verificationCodeExpiry = new Date(Date.now() + 120000); // 2 minutes from now

        await prisma.user.update({
            where: { id: user.id },
            data: {
                verificationCode,
                verificationCodeExpiry
            },
        });

        await this.sendVerificationEmail(email, verificationCode);
    }

    private generateVerificationCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    private async sendVerificationEmail(email: string, code: string): Promise<void> {
        try {
            await sendVerificationEmail(email, code);
            console.log(`Verification email sent to ${email} with code ${code}`);
        } catch (error) {
            console.error('Failed to send verification email:', error);
            throw new Error('Failed to send verification email');
        }
    }

    async forgotPassword(email: string): Promise<void> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return;
        }

        const resetToken = generateToken();
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        await prisma.user.update({
            where: { id: user.id },
            data: { resetToken, resetTokenExpiry },
        });

        await sendPasswordResetEmail(email, resetToken);
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() },
            },
        });

        if (!user) {
            throw new Error('Invalid or expired reset token');
        }

        const hashedPassword = await hashPassword(newPassword);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });
    }

    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await verifyPassword(currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        const hashedPassword = await hashPassword(newPassword);

        await prisma.user.update({
            where: { id: userId },
            data: { passwordHash: hashedPassword },
        });
    }

    async getUserProfile(userId: string): Promise<Omit<user, 'passwordHash'>> {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }

        const { passwordHash, ...userProfile } = user;
        return userProfile;
    }

    async updateUserProfile(userId: string, data: Partial<user>): Promise<Omit<user, 'passwordHash'>> {
        const { passwordHash, emailVerified, verificationCode, resetToken, resetTokenExpiry, ...updateData } = data;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });

        const { passwordHash: _, ...userProfile } = updatedUser;
        return userProfile;
    }
}