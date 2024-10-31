// api/admin/manage-testimonials/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(req, { params }) {
    const token = req.headers.get('authorization');
    const { id } = params; // Get the ID from the URL parameters

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!id) {
        return NextResponse.json({ message: 'Testimonial ID is required' }, { status: 400 });
    }

    try {
        const deletedTestimonial = await prisma.testimonial.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json(deletedTestimonial, { status: 204 }); // No content
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to delete testimonial' }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    const token = req.headers.get('authorization');
    const { id } = params; // Get the ID from the URL parameters

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json(); // Parse the request body
        const { name, content, image } = body;

        const updatedTestimonial = await prisma.testimonial.update({
            where: { id: parseInt(id) },
            data: { name, content, image },
        });

        return NextResponse.json(updatedTestimonial);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to update testimonial' }, { status: 500 });
    }
}
