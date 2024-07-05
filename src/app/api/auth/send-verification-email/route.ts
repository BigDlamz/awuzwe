import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/app/auth/services/auth.service';

const authService = new AuthService();

export async function POST(request: NextRequest) {
    try {
        const { email, code } = await request.json();

        if (!email || !code) {
            return NextResponse.json({ message: 'Email and verification code are required' }, { status: 400 });
        }

        const lowercaseEmail = email.toLowerCase();

        const sessionToken = await authService.verifyEmail(lowercaseEmail, code);

        // Create the response
        const response = NextResponse.json(
            { message: 'Email verified successfully' },
            { status: 200 }
        );

        // Set the session token as an HTTP-only cookie
        response.cookies.set({
            name: 'session',
            value: sessionToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Email verification error:', error);

        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 400 });
        } else {
            return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
        }
    }
}