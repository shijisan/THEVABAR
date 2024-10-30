import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export function middleware(req) {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token || token === 'undefined') {
        return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return NextResponse.next();
    } catch (error) {
        console.error("Token verification failed:", error);

        if (error.name === 'TokenExpiredError') {
            const response = NextResponse.redirect(new URL('/admin/login', req.url));
            response.headers.set('x-token-expired', 'true');
            return response;
        }
        
        return NextResponse.redirect(new URL('/admin/login', req.url));
    }
}

export const config = {
    matcher: ['/admin/:path*'],
};
