import {AuthService} from "@/app/auth/services/auth.service";
import {NextResponse} from "next/server";


const authService = new AuthService();

export async function POST(req: Request) {
    try {
        const { email } = await req.json();
        await authService.forgotPassword(email);
        return NextResponse.json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
    }
}