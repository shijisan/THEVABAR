"use client";

import { useState, useEffect } from "react";
import TestimonialCarousel from "@/components/TestimonialCarousel";

export default function HomePage() {
    const [testimonials, setTestimonials] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/manage-testimonials', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch testimonials');
            }

            const data = await response.json();
            setTestimonials(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this testimonial?")) {
            try {
                const response = await fetch(`/api/admin/manage-testimonials/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to delete testimonial');
                }

                fetchTestimonials();
            } catch (error) {
                setError(error.message);
            }
        }
    };

    return (
        <>
            <section className="flex items-center justify-center w-full min-h-screen ">
                <h1>This is the homepage!</h1>
            </section>
            <section className="flex items-center justify-center min-h-screen">
                <div className="w-1/2">
                    {isLoading ? (
                        <p className="text-gray-500">Loading testimonials...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : testimonials.length > 0 ? (
                        <div>
                            <TestimonialCarousel testimonials={testimonials} />
                        </div>
                    ) : (
                        <p className="mt-4 text-gray-500">No testimonials available.</p>
                    )}
                </div>
            </section>
        </>
    );
}
