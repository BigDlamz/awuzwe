import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/app/auth/services/auth.service';

const authService = new AuthService();

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        const lowercaseEmail = email.toLowerCase();

        await authService.resendVerificationEmail(lowercaseEmail);

        return NextResponse.json({ message: 'Verification code resent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error resending verification code:', error);

        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 400 });
        } else {
            return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
        }
    }
}