import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import CodeVerificationInput from "./CodeVerificationInput";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface VerificationFormProps {
    email: string;
}

const VerificationForm: React.FC<VerificationFormProps> = ({ email }) => {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [countdown, setCountdown] = useState(120); // 2 minutes countdown

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0 && !isVerified) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown, isVerified]);

    useEffect(() => {
        let redirectTimer: NodeJS.Timeout;
        if (isVerified) {
            redirectTimer = setTimeout(() => router.push('/dashboard'), 3000);
        }
        return () => clearTimeout(redirectTimer);
    }, [isVerified, router]);

    const handleVerification = async (code: string) => {
        setIsLoading(true);
        setVerificationMessage(null);
        try {
            const response = await fetch('/api/auth/send-verification-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });

            if (response.ok) {
                const data = await response.json();
                // Set the session token as an HTTP-only cookie
                document.cookie = `session=${data.sessionToken}; path=/; HttpOnly; Secure; SameSite=Strict`;
                setIsVerified(true);
                setVerificationMessage({ type: 'success', message: "Email verified successfully! Redirecting to dashboard..." });
            } else {
                const data = await response.json();
                setVerificationMessage({ type: 'error', message: data.message || "Verification failed. Please try again." });
            }
        } catch (error) {
            console.error('Verification error:', error);
            setVerificationMessage({ type: 'error', message: "An unexpected error occurred. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        setIsResending(true);
        setVerificationMessage(null);
        try {
            const response = await fetch('/api/auth/resend-verification-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setCountdown(120); // Reset countdown
                toast({
                    title: "Success",
                    description: "A new verification code has been sent to your email.",
                });
            } else {
                const data = await response.json();
                setVerificationMessage({ type: 'error', message: data.message || "Failed to resend verification code. Please try again." });
            }
        } catch (error) {
            console.error('Resend code error:', error);
            setVerificationMessage({ type: 'error', message: "An unexpected error occurred while resending the code. Please try again." });
        } finally {
            setIsResending(false);
        }
    };

    return (
        <Card className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="p-6 rounded-br-[40px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#3B82F6]"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-[#0F172A] to-[#0F172A] opacity-60"></div>
                <h2 className="text-3xl font-bold text-center text-white relative z-10">Verify Email</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <p className="text-sm text-gray-600">
                    A verification code has been sent to <strong>{email}</strong>. Please enter it below to complete your registration.
                </p>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
                    <CodeVerificationInput onComplete={handleVerification} isLoading={isLoading} isDisabled={isVerified} />
                </div>
                {isLoading && (
                    <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                        <span className="ml-2 text-gray-600">Verifying...</span>
                    </div>
                )}
                {verificationMessage && (
                    <Alert
                        variant={verificationMessage.type === 'success' ? 'default' : 'destructive'}
                        className={verificationMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : ''}
                    >
                        {verificationMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        <AlertTitle>{verificationMessage.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
                        <AlertDescription>{verificationMessage.message}</AlertDescription>
                    </Alert>
                )}
                {!isVerified && (
                    <>
                        <p className="text-sm text-gray-500 text-center">
                            Code expires in: {Math.floor(countdown / 60)}:{countdown % 60 < 10 ? '0' : ''}{countdown % 60}
                        </p>
                        <Button
                            onClick={handleResendCode}
                            variant="outline"
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold text-lg"
                            disabled={isLoading || isResending || countdown > 0}
                        >
                            {isResending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Resending...
                                </>
                            ) : (
                                'Resend Code'
                            )}
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default VerificationForm;