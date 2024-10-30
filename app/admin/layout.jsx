"use client"; 
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

export default function AdminLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt.decode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          router.push("/admin/login");
        }
      } catch (error) {
        console.error("Token decoding error:", error);
      }
    } else {
      router.push("/admin/login"); 
    }
  }, [router]);

  return <>{children}</>; 
}
