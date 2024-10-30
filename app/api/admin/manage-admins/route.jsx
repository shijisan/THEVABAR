import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
    try {
        const admins = await prisma.admin.findMany({
            select: {
                id: true,
                email: true,
                origin: true,
            },
        });
        return NextResponse.json(admins);
    } catch (error) {
        console.error('Error fetching admins:', error);
        return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const originAdmin = decoded.email; 

        console.log(originAdmin);

        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        if (!originAdmin) {
            return NextResponse.json({ error: "Origin admin is required" }, { status: 400 });
        }

        const existingAdmin = await prisma.admin.findUnique({ where: { email } });
        if (existingAdmin) {
            return NextResponse.json({ error: "Admin already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await prisma.admin.create({
            data: {
                email,
                password: hashedPassword,
                origin: originAdmin, 
            },
        });

        return NextResponse.json({
            id: newAdmin.id,
            email: newAdmin.email,
            origin: newAdmin.origin,
        });
    } catch (error) {
        console.error("Error creating admin:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
