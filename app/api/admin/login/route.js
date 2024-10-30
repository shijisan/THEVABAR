import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function POST(req) {
    const { email, password } = await req.json();
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
        return new Response(JSON.stringify({ message: "Invalid credentials." }), { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
        return new Response(JSON.stringify({ message: "Invalid credentials." }), { status: 401 });
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return new Response(JSON.stringify({ token }), { status: 201 });
}
