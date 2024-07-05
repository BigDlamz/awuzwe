'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/lib/schemas";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {z} from "zod";

const ForgotPasswordForm: React.FC = () => {
    const router = useRouter();
    const { toast } = useToast();
    const form = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                toast({
                    title: "Reset email sent",
                    description: "Check your email for password reset instructions.",
                });
                router.push('/auth/login');
            } else {
                const data = await response.json();
                toast({
                    title: "Error",
                    description: data.message,
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            toast({
                title: "Error",
                description: "An error occurred while processing your request",
                variant: "destructive",
            });
        }
    };

    return (
        <Card className="w-[350px]">
        <CardHeader>
            <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
    </CardHeader>
    <CardContent>
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
    <FormField
        control={form.control}
    name="email"
    render={({ field }) => (
        <FormItem>
            <FormLabel>Email</FormLabel>
        <FormControl>
        <Input placeholder="Email" {...field} />
    </FormControl>
    <FormMessage />
    </FormItem>
)}
    />
    <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold text-lg">Reset Password</Button>
    </form>
    </Form>
    </CardContent>
    <CardFooter>
    <Button variant="link" className="w-full" onClick={() => router.push('/auth/login')}>
    Back to Login
    </Button>
    </CardFooter>
    </Card>
);
};

export default ForgotPasswordForm;