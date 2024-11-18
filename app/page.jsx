"use client";

import { useState, useEffect } from "react";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

export default function HomePage() {
    const [testimonials, setTestimonials] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [openIndex, setOpenIndex] = useState(null);
    const toggleAnswer = (index) => {
      setOpenIndex(openIndex === index ? null : index);
    };

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

    const faqData = [
        {
          question: "What is Next.js?",
          answer: "Next.js is a React framework that enables server-side rendering and static site generation for optimized performance."
        },
        {
          question: "How do I install Next.js?",
          answer: "You can install Next.js by running `npx create-next-app` followed by your project name."
        },
        {
          question: "What is FontAwesome?",
          answer: "FontAwesome is an icon library used by developers to easily add icons to their projects."
        },
      ];

    return (
        <>
            <section className="w-full min-h-screen bg-red-950 hero">
                <div className="w-full min-h-screen heroClip"></div>
                <div className="absolute top-0 flex flex-col items-center justify-center w-full h-full">
                    <h1 className="py-3 text-5xl font-medium text-center text-transparent fill-transparent bg-clip-text bg-gradient-to-b from-yellow-50 to-yellow-200">This is the homepage!</h1>
                    <p className="text-center text-yellow-600 lg:w-4/6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus feugiat libero id nisl fermentum, a malesuada nunc ullamcorper. Nullam vel nisi at nunc venenatis facilisis. Curabitur at malesuada odio, sit amet luctus orci.</p>
                    <a href="/" className="p-2 mt-5 transition-colors bg-yellow-200 rounded-md shadow hover:bg-yellow-300 text-red-950">Learn More</a>
                </div>
            </section>

            <section className="flex flex-col w-full min-h-screen lg:flex-row bg-red-950">
                <div className="flex flex-col justify-center w-full min-h-screen p-4 lg:w-1/2 about">
                    <h2 className="font-bold text-9xl">Text Text</h2>
                    <br />
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus feugiat libero id nisl fermentum, a malesuada nunc ullamcorper. Nullam vel nisi at nunc venenatis facilisis. Curabitur at malesuada odio, sit amet luctus orci.</p>
                    <br />
                    <div>
                        <button className="w-32 p-2 transition-colors bg-yellow-200 rounded-md shadow hover:bg-yellow-300 text-red-950">CTA</button>
                    </div>
                </div>
                <div className="grid lg:w-1/2 w-full pt-[10vh] min-h-[90vh] grid-cols-2 grid-rows-2 gap-2 p-5">
                    <div className="flex flex-col justify-center">
                        <img src="https://placehold.co/200x100/webp" alt="important person" />
                        <div className="relative -top-6">
                            <h1 className="text-2xl font-bold">Name Name</h1>
                            <h3 className="italic text-yellow-200">Title</h3>
                            <p className="text-xs text-yellow-100">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus feugiat libero id nisl fermentum, a malesuada nunc ullamcorper. Nullam vel nisi at nunc venenatis facilisis. Curabitur at malesuada odio.</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <img src="https://placehold.co/200x100/webp" alt="important person" />
                        <div className="relative -top-6">
                            <h1 className="text-2xl font-bold">Name Name</h1>
                            <h3 className="italic text-yellow-200">Title</h3>
                            <p className="text-xs text-yellow-100">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus feugiat libero id nisl fermentum, a malesuada nunc ullamcorper. Nullam vel nisi at nunc venenatis facilisis. Curabitur at malesuada odio.</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <img src="https://placehold.co/200x100/webp" alt="important person" />
                        <div className="relative -top-6">
                            <h1 className="text-2xl font-bold">Name Name</h1>
                            <h3 className="italic text-yellow-200">Title</h3>
                            <p className="text-xs text-yellow-100">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus feugiat libero id nisl fermentum, a malesuada nunc ullamcorper. Nullam vel nisi at nunc venenatis facilisis. Curabitur at malesuada odio.</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <img src="https://placehold.co/200x100/webp" alt="important person" />
                        <div className="relative -top-6">
                            <h1 className="text-2xl font-bold">Name Name</h1>
                            <h3 className="italic text-yellow-200">Title</h3>
                            <p className="text-xs text-yellow-100">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus feugiat libero id nisl fermentum, a malesuada nunc ullamcorper. Nullam vel nisi at nunc venenatis facilisis. Curabitur at malesuada odio.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="flex items-center justify-center min-h-screen">
                <div className="w-full">
                    {isLoading ? (
                        <p className="text-gray-500">Loading testimonials...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : testimonials.length > 0 ? (
                        <div>
                            <h1 className="mb-4 text-4xl font-medium text-center">Testimonials</h1>
                            <TestimonialCarousel testimonials={testimonials} />
                        </div>
                    ) : (
                        <p className="mt-4 text-gray-500">No testimonials available.</p>
                    )}
                </div>
            </section>

            <section className="flex lg:flex-row flex-col items-center justify-center min-h-screen pt-[10vh]">
                <div className="flex items-center justify-center w-full lg:w-1/2 lg:full h-1/2">
                    <img src="https://placehold.co/300x300/webp" alt="vabarlogo" />
                </div>
                <div className="w-full max-w-2xl p-4 mx-auto lg:w-1/2 faq-section">
                    <h2 className="mb-6 text-2xl font-bold">Frequently Asked Questions</h2>
                    {faqData.map((item, index) => (
                        <div key={index} className="p-5 my-3 bg-gray-100 border border-gray-300 rounded-lg faq-item">
                        <button
                            className="flex items-center justify-between w-full text-left"
                            onClick={() => toggleAnswer(index)}
                        >
                            <span className="font-semibold">{item.question}</span>
                            <FontAwesomeIcon icon={openIndex === index ? faChevronUp : faChevronDown} />
                        </button>
                        {openIndex === index && (
                            <p className="mt-2 text-gray-700">{item.answer}</p>
                        )}
                        </div>
                    ))}
                </div>
            </section>

        </>
    );
}
