import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(req, {params}){
    const {id} = await params;
    const {email, password} = await req.json();
    const token = req.headers.get("Authorization")?.replace('Bearer');

    if (!token){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    try{
        const adminToUpdate = await prisma.admin.findUnique({where: {id: parseInt(id)}});
        if (!adminToUpdate){
            return NextResponse.json({error: "Admin not found"}, {status: 404});
        }

        const updatedData = {};
        if (email) updatedData.email = email;
        if (password) updatedData.password = await bcrypt.hash(password, 10);

        const updatedAdmin = await prisma.admin.update({
            where: {id : parseInt(id)},
            data: {...updatedData},
        });

        return NextResponse.json(updatedAdmin, {status: 200});
    }
    catch (error){
        console.error("Error updating admin: ", error);
        return NextResponse.json({error: "Failed to update admin."}, {status: 500});
    }

}

export async function DELETE(req, {params}){
    const {id} = await params;
    const token = req.headers.get("Authorization")?.replace('Bearer ', '');

    if (!token){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    try{
        const adminToDelete = await prisma.admin.findUnique({
            where: {id: parseInt(id)},
        });

        if (!adminToDelete){
            return NextResponse.json({error: "Admin not found."}, {status: 404});
        }

        await prisma.admin.delete({
            where: {id: parseInt(id)}
        });

        return NextResponse.json({message: "Admin deleted successfully."}, {status: 200});
    }
    catch (error){
        console.error("Error deleting admin.", error);
        return NextResponse.json({error: "Failed to delete admin."}, {status: 500})
    }

}