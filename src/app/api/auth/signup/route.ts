import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from "@/app/auth/services/auth.service";
import { logger } from "../../../../../logger";

const authService = new AuthService();

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        const user = await authService.signup(email, password);
        return NextResponse.json({ message: 'User created successfully', userId: user.id }, { status: 201 });
    } catch (error) {
        logger.error('Signup error:', error);
        if (error instanceof Error) {
            if (error.message === 'Email already in use') {
                return NextResponse.json({ message: 'Email already in use' }, { status: 409 });  // 409 Conflict
            }
        }
        return NextResponse.json({ message: 'An error occurred during signup' }, { status: 500 });
    }
}