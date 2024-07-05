import {NextResponse} from "next/server";
import {AuthService} from "@/app/auth/services/auth.service";

const authService = new AuthService();

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();
        await authService.resetPassword(token, password);
        return NextResponse.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
    }
}