import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validateSession } from "@/app/utils/auth/session";
import { AuthService } from '@/app/auth/services/auth.service';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

const authService = new AuthService();

export default async function DashboardPage() {
    const sessionToken = cookies().get('session')?.value;
    if (!sessionToken) {
        redirect('/auth/login');
    }
    const userId = await validateSession(sessionToken);
    if (!userId) {
        redirect('/auth/login');
    }

    const userProfile = await authService.getUserProfile(userId);

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <form action="/api/auth/logout" method="POST">
                    <Button type="submit" variant="outline">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </form>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <User className="mr-2 h-5 w-5" />
                            User Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p><strong>Email:</strong> {userProfile.email}</p>
                    </CardContent>
                </Card>
                {/* Add more cards here for additional dashboard content */}
            </div>
        </div>
    );
}