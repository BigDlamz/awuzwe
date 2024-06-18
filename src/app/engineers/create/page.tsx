
import dynamic from 'next/dynamic';
import Head from 'next/head';
import EngineerSignup from "@/app/engineers/create/EngineerSignup";

const CreateEngineer = dynamic(() => import('./EngineerSignup'), { ssr: false });

export default function Page() {
    return (
        <>
            <Head>
                <title>Engineer Details</title>
            </Head>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <EngineerSignup />
            </div>
        </>
    );
}
