'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/schemas";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock } from "lucide-react";
import { z } from "zod";
import SocialLoginButtons from './SocialLoginButtons';

const LoginForm: React.FC = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
        setIsLoading(true);
        setLoginError(null);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Logged in successfully. Redirecting...",
                });
                router.push('/dashboard');
            } else {
                const data = await response.json();
                setLoginError(data.message || "Login failed. Please try again.");
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoginError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGitHubLogin = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/github', {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                window.location.href = data.url;
            } else {
                throw new Error('Failed to initiate GitHub login');
            }
        } catch (error) {
            console.error('GitHub login error:', error);
            toast({
                title: "Error",
                description: "Failed to initiate GitHub login. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/google', {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                window.location.href = data.url;
            } else {
                throw new Error('Failed to initiate Google login');
            }
        } catch (error) {
            console.error('Google login error:', error);
            toast({
                title: "Error",
                description: "Failed to initiate Google login. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="p-6 rounded-br-[40px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#3B82F6]"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-[#0F172A] to-[#0F172A] opacity-60"></div>
                <h2 className="text-5xl font-bold text-center text-white relative z-10" style={{ fontFamily: 'Inter, sans-serif' }}>awuzwe!</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <p className="text-sm text-gray-600 uppercase tracking-wider text-center font-semibold">Log in to your account</p>
                <SocialLoginButtons
                    onGitHubLogin={handleGitHubLogin}
                    onGoogleLogin={handleGoogleLogin}
                    iconSize={28}
                    iconClassName="mr-3"
                />
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-600">
                            Or log in with email
                        </span>
                    </div>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <Mail size={18} />
                                            </div>
                                            <Input
                                                placeholder="you@example.com"
                                                {...field}
                                                disabled={isLoading}
                                                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <Lock size={18} />
                                            </div>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                {...field}
                                                disabled={isLoading}
                                                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />
                        {loginError && (
                            <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-700">
                                <AlertDescription>{loginError}</AlertDescription>
                            </Alert>
                        )}
                        <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold text-lg" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Logging In...
                                </>
                            ) : (
                                'Log In'
                            )}
                        </Button>
                        <Button
                            variant="link"
                            className="w-full text-blue-600 hover:text-blue-700 font-medium"
                            onClick={() => router.push('/auth/reset-password')}
                            disabled={isLoading}
                        >
                            Forgot Password?
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="p-4 flex justify-center">
                <Button
                    variant="link"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                    onClick={() => router.push('/auth/signup')}
                    disabled={isLoading}
                >
                    Don't have an account? Sign up
                </Button>
            </CardFooter>
        </Card>
    );
};

export default LoginForm;