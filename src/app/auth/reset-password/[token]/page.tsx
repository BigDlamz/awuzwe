import { Suspense } from 'react';
import ResetPasswordForm from "@/app/auth/components/ResetPasswordForm";


export default function ResetPasswordTokenPage({ params }: { params: { token: string } }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <ResetPasswordForm token={params.token} />
        </div>
    );
}