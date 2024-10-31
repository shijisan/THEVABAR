import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the path to your prisma instance

// GET request to fetch all testimonials
export async function GET(req) {
    const token = req.headers.get('authorization');

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Optionally validate the token here
        // If using JWT, verify it here and handle accordingly.

        // Fetch all testimonials from the database
        const testimonials = await prisma.testimonial.findMany();
        return NextResponse.json(testimonials);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to fetch testimonials' }, { status: 500 });
    }
}

// POST request to create a new testimonial
export async function POST(req) {
    const token = req.headers.get('authorization');

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json(); // Parse JSON body
        const { name, content, image } = body; // Destructure data from the body

        // Basic validation
        if (!name || !content || !image) {
            return NextResponse.json({ message: 'Name, content, and image are required' }, { status: 400 });
        }

        // Create a new testimonial in the database
        const newTestimonial = await prisma.testimonial.create({
            data: {
                name,
                content,
                image, // Image URL from Cloudinary
            },
        });

        return NextResponse.json(newTestimonial, { status: 201 }); // Return created testimonial
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to create testimonial' }, { status: 500 });
    }
}
