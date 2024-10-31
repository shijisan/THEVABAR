"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import LoadingPage from "@/components/LoadingPage";
import LoadingOverlay from "@/components/LoadingOverlay"; // Import the LoadingOverlay component
import AdminSideBar from "@/components/AdminSideBar";
import TestimonialCarousel from "@/components/TestimonialCarousel";

export default function TestimonialPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [testimonials, setTestimonials] = useState([]);
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [fileInputKey, setFileInputKey] = useState(Date.now());
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchTestimonials();
        } else {
            router.push('/admin/login');
        }
    }, [router]);

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

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        const data = await response.json();
        return data.secure_url; // Return the secure image URL
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this testimonial?")) {
            try {
                setIsLoading(true); // Start loading
                const response = await fetch(`/api/admin/manage-testimonials/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to delete testimonial');
                }

                // Fetch testimonials again to refresh the list
                await fetchTestimonials();
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false); // Stop loading
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            setError("No image file selected.");
            return;
        }

        try {
            setIsLoading(true); // Start loading
            const imageUrl = await uploadImageToCloudinary(image);

            const testimonialData = {
                name,
                content,
                image: imageUrl,
            };

            const response = await fetch('/api/admin/manage-testimonials', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testimonialData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit testimonial');
            }

            await fetchTestimonials();

            // Reset form fields
            setName('');
            setContent('');
            setImage(null);
            setError(null);
            setFileInputKey(Date.now());
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    if (isLoading) {
        return <LoadingPage />; // Show loading page while fetching testimonials
    }

    return (
        <div className="flex">
            <AdminSideBar />
            <section className="flex flex-col items-center w-10/12 p-5 justify-evenly">
                <div className="flex flex-col items-center justify-center w-full max-w-lg min-h-screen">
                    <form onSubmit={handleSubmit} className="flex flex-col p-6 space-y-4 bg-white rounded shadow">
                        <h1 className="mb-1 text-2xl font-bold text-center">Add Testimonial</h1>

                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="p-2 border border-gray-300 rounded"
                        />
                        <textarea
                            placeholder="Content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            className="p-2 border border-gray-300 rounded"
                        />
                        <input
                            id="image-input"
                            key={fileInputKey}
                            type="file"
                            accept=".jpg,.png"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                setImage(file || null);
                            }}
                            className="p-2 border border-gray-300 rounded"
                        />
                        <button type="submit" className="p-2 text-white bg-blue-500 rounded">
                            {isLoading ? 'Adding...' : 'Add Testimonial'}
                        </button>

                        {error && <p className="text-red-500">{error}</p>}
                    </form>
                </div>
                <div className="flex flex-col justify-center w-1/2 min-h-screen">
                    {testimonials.length > 0 ? (
                        <div>
                            <TestimonialCarousel testimonials={testimonials} />
                            <h2 className="mt-4 text-lg font-bold">Manage Testimonials</h2>
                            <ul>
                                {testimonials.map(testimonial => (
                                    <li key={testimonial.id} className="flex items-center justify-between py-2 border-b">
                                        <span>{testimonial.name}: {testimonial.content}</span>
                                        <button 
                                            onClick={() => handleDelete(testimonial.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="mt-4 text-gray-500">No testimonials available.</p>
                    )}
                </div>
            </section>
            {isLoading && <LoadingOverlay />} {/* Show the loading overlay when loading */}
        </div>
    );
}
