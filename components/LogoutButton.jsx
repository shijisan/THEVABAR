"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingOverlay from "./LoadingOverlay";

export default function LogoutButton(){

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = () =>{
        setIsLoading(true);
        localStorage.removeItem('token');
        setTimeout(() =>{
            setIsLoading(false);
            router.push('/admin/login');
        }, 2000);
    }

    return(
    <>
        <button onClick={handleLogout} className="p-2 bg-yellow-200 border rounded-lg text-red-950 hover:bg-yellow-300">Logout</button>
        <LoadingOverlay isLoading={isLoading} />
    </>
    );
}