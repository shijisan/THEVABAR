"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); 
        setErrorMessage('');

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.status === 201) { // Check for successful authentication
                const { token } = await res.json();
                localStorage.setItem('token', token);
                
                setIsLoading(false);
                router.push('/admin/dashboard');
            } else {
                setErrorMessage("Invalid email or password.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage("An error occurred during login.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="flex items-center justify-center w-full min-h-screen">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-5 bg-white border rounded-lg border-red-950 lg:w-1/3">
                <h2 className="text-2xl font-medium text-center">Admin Login</h2>
                <div className="flex flex-col w-full">
                    <label htmlFor="email">Email:</label>
                    <input
                        className="p-1 border"
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="joemama@example.com"
                        required
                    />
                </div>
                <div className="flex flex-col w-full">
                    <label htmlFor="password">Password:</label>
                    <input
                        className="p-1 border"
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                        required
                    />
                </div>
                <button className="w-full p-1 bg-yellow-200 rounded hover:bg-yellow-300 text-red-950" type="submit" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Login"}
                </button>
                {errorMessage && <p className="text-sm text-center text-red-500">{errorMessage}</p>}
            </form>

            {isLoading && <LoadingOverlay />}
        </section>
    );
}
