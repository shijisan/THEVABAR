"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import LoadingPage from "@/components/LoadingPage";
import LoadingOverlay from "@/components/LoadingOverlay";
import AdminSideBar from "@/components/AdminSideBar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function TestimonialPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [testimonials, setTestimonials] = useState([]);
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [fileInputKey, setFileInputKey] = useState(Date.now());
    const [editingTestimonial, setEditingTestimonial] = useState(null); // Store the testimonial being edited
    const [showModal, setShowModal] = useState(false); // To control modal visibility
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
        return data.secure_url;
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this testimonial?")) {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/admin/manage-testimonials/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to delete testimonial');
                }

                await fetchTestimonials();
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
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
            setIsLoading(true);
            const imageUrl = await uploadImageToCloudinary(image);

            const testimonialData = {
                name,
                content,
                image: imageUrl,
            };

            const method = editingTestimonial ? 'PUT' : 'POST'; // Use PUT for updating
            const url = editingTestimonial ? `/api/admin/manage-testimonials/${editingTestimonial.id}` : '/api/admin/manage-testimonials';

            const response = await fetch(url, {
                method,
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

            setName('');
            setContent('');
            setImage(null);
            setError(null);
            setFileInputKey(Date.now());
            setEditingTestimonial(null); // Clear the editing testimonial
            setShowModal(false); // Close the modal
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (testimonial) => {
        setEditingTestimonial(testimonial);
        setName(testimonial.name);
        setContent(testimonial.content);
        setImage(testimonial.image);
        setShowModal(true);
    };

    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <div className="flex">
            <AdminSideBar />
            <section className="flex flex-row items-center w-10/12 p-5 bg-white justify-evenly">
                <div className="flex flex-col items-center justify-center w-full min-h-screen">
                    {/* Table for displaying testimonials */}
                    <div className="w-full">
                        <div className="w-full border-b-2">
                            <h2 className="mb-4 text-2xl font-bold">Manage Testimonials</h2>
                        </div>
                        <div className="flex justify-end w-full">
                            <button
                                onClick={() => setShowModal(true)}
                                className="p-2 my-2 bg-yellow-200 rounded text-red-950 hover:bg-yellow-300"
                            >
                                <FontAwesomeIcon icon={faPlus} /> Add Testimonial
                            </button>
                        </div>
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr>
                                    <th className="p-2 border">Name</th>
                                    <th className="p-2 border">Content</th>
                                    <th className="p-2 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {testimonials.length > 0 ? (
                                    testimonials.map((testimonial) => (
                                        <tr key={testimonial.id}>
                                            <td className="p-2 border">{testimonial.name}</td>
                                            <td className="p-2 border">{testimonial.content}</td>
                                            <td className="p-2 border">
                                                <button
                                                    onClick={() => handleEdit(testimonial)}
                                                    className="p-2 text-sm bg-yellow-200 rounded text-red-950 hover:bg-yellow-300"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(testimonial.id)}
                                                    className="p-2 text-sm text-yellow-200 rounded bg-red-950 hover:bg-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="p-2 text-center">
                                            No testimonials available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
            {isLoading && <LoadingOverlay />}

            {/* Modal for Add/Edit Testimonial */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
                    <div className="w-full max-w-md p-6 bg-white rounded shadow">
                        <h2 className="mb-4 text-2xl font-bold">{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            <textarea
                                placeholder="Content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded"
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
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded">
                                {isLoading ? 'Submitting...' : editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
                            </button>
                            {error && <p className="text-red-500">{error}</p>}
                        </form>
                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full p-2 mt-4 text-white bg-gray-500 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
