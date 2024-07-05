'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/schemas";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import PasswordStrength from "@/app/auth/signup/components/PasswordStrength";
import { Loader2, Mail, Lock } from "lucide-react";
import EmailVerificationForm from "@/app/auth/verify-email/components/EmailVerificationForm";

const SignupForm: React.FC = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [emailError, setEmailError] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const signupForm = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        },
    });

    const onSignupSubmit = async (values: z.infer<typeof signupSchema>) => {
        setIsLoading(true);
        setEmailError(null);
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                toast({
                    title: "Account created.",
                    description: "Please check your email for the verification code.",
                });
                setEmail(values.email);
                setIsVerifying(true);
            } else {
                const data = await response.json();
                if (response.status === 409) {
                    setEmailError(data.message);
                } else {
                    toast({
                        title: "Error",
                        description: data.message,
                        variant: "destructive",
                    });
                }
            }
        } catch (error) {
            console.error('Signup error:', error);
            toast({
                title: "Error",
                description: "An error occurred during signup",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isVerifying) {
        return <EmailVerificationForm email={email} />;
    }

    return (
        <Card className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="p-6 rounded-br-[40px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#3B82F6]"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-[#0F172A] to-[#0F172A] opacity-60"></div>
                <h2 className="text-5xl font-bold text-center text-white relative z-10" style={{ fontFamily: 'Inter, sans-serif' }}>awuzwe!</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <p className="text-sm text-gray-600 uppercase tracking-wider text-center font-semibold">Create your account</p>
                <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                        <FormField
                            control={signupForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <Mail size={18} />
                                            </div>
                                            <Input placeholder="you@example.com" {...field} disabled={isLoading} className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                    {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={signupForm.control}
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
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setPassword(e.target.value);
                                                }}
                                                disabled={isLoading}
                                                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    </FormControl>
                                    <PasswordStrength password={password} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={signupForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 font-medium">Confirm Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <Lock size={18} />
                                            </div>
                                            <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold text-lg" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Signing Up...
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="bg-gray-50 p-6">
                <Button variant="link" className="w-full text-blue-600 hover:text-blue-700 font-medium" onClick={() => router.push('/auth/login')} disabled={isLoading}>
                    Already have an account? Log in
                </Button>
            </CardFooter>
        </Card>
    );
};

export default SignupForm;