import { Suspense } from 'react';
import ResetPasswordForm from "@/app/auth/components/ResetPasswordForm";


export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <ResetPasswordForm />
        </div>
    );
}