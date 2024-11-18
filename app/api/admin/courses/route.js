import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req){
    try{
        const courses = await prisma.course.findMany();
        return NextResponse.json(courses);
    }
    catch(error){
        console.error("Error fetching courses:", error);
        return NextResponse.json({error: "Failed to fetch courses"}, {status: 500});
    }
}

export async function POST(req){
    const {name, description, price} = await req.json();

    if (!name || ! description || typeof price !== "number"){
        return NextResponse.json({error: "Please provide all required fields"},{status: 400});
    }
    try{
        const course = await prisma.course.create({
            data: {name, description, price},
        });
        return NextResponse.json(course);
    }
    catch(error){
        console.log("Error creating course", error);
        return NextResponse.json({error: "Failed to create course."}, {status: 500});
    }
}