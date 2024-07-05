import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {AuthService} from "@/app/auth/services/auth.service";

const authService = new AuthService();

export async function POST(request: NextRequest) {
    const sessionToken = cookies().get('session')?.value;

    if (sessionToken) {
        await authService.logout(sessionToken);
    }

    cookies().set('session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 0,
        path: '/',
    });

    return NextResponse.json({ message: 'Logged out successfully' });
}