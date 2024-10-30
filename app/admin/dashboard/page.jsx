"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import LoadingOverlay from "@/components/LoadingOverlay"; 
import LoadingPage from "@/components/LoadingPage";
import AdminSideBar from "@/components/AdminSideBar";

export default function AdminDashboardPage() {
    const [isLoading, setIsLoading] = useState(true); 
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoading(false);
        } else {
            router.push('/admin/login');
        }
    }, [router]);

    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <>
            <div className="flex">
                <AdminSideBar />
                <section className="flex items-center justify-center w-full h-full min-h-screen">
                    <h1>Hello, Admin!</h1>
                </section>
            </div>
        </>

    );
}
