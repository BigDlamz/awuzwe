'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'react-hot-toast';
import {withAuth} from "next-auth/middleware";

function ProfilePage() {
    const [user, setUser] = useState({ email: '', createdAt: '' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/user');
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    toast.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error('An error occurred while fetching user data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto mt-8">
            <Card className="w-[350px] mx-auto">
                <CardHeader>
                    <h2 className="text-2xl font-bold text-center">Profile</h2>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Email:</label>
                            <Input value={user.email} disabled />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Joined:</label>
                            <Input value={new Date(user.createdAt).toLocaleDateString()} disabled />
                        </div>
                        <Button className="w-full">Change Password</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// @ts-ignore
export default withAuth(ProfilePage);