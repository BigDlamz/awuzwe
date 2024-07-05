import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AuthService } from "@/app/auth/services/auth.service";
import { logger } from "../../../../../logger";


//TODO add rate limiting to prevent brute force attacks
//TODO add captcha to prevent bot attacks
const authService = new AuthService();

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        const sessionToken = await authService.login(email, password);

        cookies().set('session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return NextResponse.json({ message: 'Logged in successfully' });
    } catch (error) {
        logger.error('Login error:', error);

        if (error instanceof Error) {
            // Send a generic error message to the client for security reasons
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        } else {
            return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
        }
    }
}