'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateEngineer() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [city, setCity] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('/api/engineers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                surname,
                city,
                contactNumber,
            }),
        });

        if (res.ok) {
            router.push('/engineers'); // Redirect to the engineers listing page
        } else {
            console.error('Failed to create engineer profile');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">Create Engineer Profile</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Surname</label>
                            <input
                                type="text"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Surname"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">City</label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="City"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                            <input
                                type="text"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Contact Number"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Create Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
