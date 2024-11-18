import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req, {params}){
    const {id} = params;
    const {name, description, price} = await req.json();

    if (!name || !description || !price){
        return NextResponse.json({error: "All fields are required"}, {status: 400});
    }

    try{
        const updatedCourse = await prisma.course.update({
            where: {id: parseInt(id)},
            data:{
                name,
                description,
                price,
            },
        });

        return NextResponse.json(updatedCourse);
    }
    catch(error){
        return NextResponse.json({error: "Failed to update the course."}, {status: 500});
    }

}

export async function DELETE(req, {params}){
    const {id} = params;

    try{
        await prisma.course.delete({
            where: {id: parseInt(id)},
        });
        return NextResponse.json({message: "Course deleted successfully."});
    }
    catch (error){
        return NextResponse({error: "Failed to delete the course."}, {status: 500});
    }
}