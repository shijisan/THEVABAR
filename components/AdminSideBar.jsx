"use client"
import { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";
import jwt from 'jsonwebtoken';

export default function AdminSideBar() {

    const [authedAdmin, setAuthedAdmin] = useState(null);

    useEffect(() =>{
        const token = localStorage.getItem('token');
        if (token){
            const decodedToken = jwt.decode(token);
            setAuthedAdmin(decodedToken?.email);
        }

    }, []);

    return (
        <>
            <nav className="flex flex-col items-center w-2/12 min-h-screen bg-white border-e">
                <div className="fixed lg:w-2/12">
                    <div className="flex flex-col py-5 items-center justify-center w-full mt-[10vh] border-b aspect-square">
                        <img src="https://placehold.co/150x150/webp" className="rounded-full aspect-square" alt="AdminImage" />
                        <p className="pt-5 text-black">{authedAdmin}</p>
                    </div>
                    <ul className="flex flex-col w-full text-center">
                        <li className="bg-neutral-200">
                            <a className="flex items-center justify-center w-full h-10" href="/admin/dashboard">Dashboard</a>
                        </li>
                        <li className="bg-neutral-100">
                            <a className="flex items-center justify-center w-full h-10" href="/admin/manage-admins">Manage Admins</a>
                        </li>
                        <li className="bg-neutral-200">
                            <a className="flex items-center justify-center w-full h-10" href="/admin/testimonials">Testimonials</a>
                        </li>
                        <li className="bg-neutral-100">
                            <a className="flex items-center justify-center w-full h-10" href="/admin/courses">Courses</a>
                        </li>
                        <li className="my-3">
                            <LogoutButton />
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
}
