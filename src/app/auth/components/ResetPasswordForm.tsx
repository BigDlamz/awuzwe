'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock } from "lucide-react";

const requestResetSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});

const resetPasswordSchema = z.object({
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

interface ResetPasswordFormProps {
    token?: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token }) => {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const requestForm = useForm({
        resolver: zodResolver(requestResetSchema),
        defaultValues: { email: "" },
    });

    const resetForm = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    const onRequestSubmit = async (values: z.infer<typeof requestResetSchema>) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                setSuccess("Password reset link sent to your email. Please check your inbox.");
                requestForm.reset();
            } else {
                const data = await response.json();
                setError(data.message || "Failed to send reset link. Please try again.");
            }
        } catch (error) {
            console.error('Request reset error:', error);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const onResetSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password: values.password }),
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Password reset successfully. You can now log in with your new password.",
                });
                router.push('/auth/login');
            } else {
                const data = await response.json();
                setError(data.message || "Failed to reset password. Please try again.");
            }
        } catch (error) {
            console.error('Reset password error:', error);
            setError("An unexpected error occurred. Please try again.");
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
                <p className="text-sm text-gray-600 uppercase tracking-wider text-center font-semibold">
                    {token ? 'Reset Your Password' : 'Request Password Reset'}
                </p>
                {!token ? (
                    <Form {...requestForm}>
                        <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-4">
                            <FormField
                                control={requestForm.control}
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
                            {error && (
                                <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-700">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            {success && (
                                <Alert variant="default" className="bg-green-50 border-green-200 text-green-700">
                                    <AlertDescription>{success}</AlertDescription>
                                </Alert>
                            )}
                            <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold text-lg" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Sending Reset Link...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </Button>
                        </form>
                    </Form>
                ) : (
                    <Form {...resetForm}>
                        <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                            <FormField
                                control={resetForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 font-medium">New Password</FormLabel>
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
                            <FormField
                                control={resetForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 font-medium">Confirm New Password</FormLabel>
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
                            {error && (
                                <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-700">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold text-lg" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Resetting Password...
                                    </>
                                ) : (
                                    'Reset Password'
                                )}
                            </Button>
                        </form>
                    </Form>
                )}
            </CardContent>
            <CardFooter className="p-4 flex justify-center">
                <Button
                    variant="link"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                    onClick={() => router.push('/auth/login')}
                    disabled={isLoading}
                >
                    Back to Login
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ResetPasswordForm;