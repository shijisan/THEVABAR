import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createCanvas, loadImage } from "canvas";

export async function POST(req) {
  try {
    const { courseId, uniqueID, image, qrCodeImage } = await req.json();

    if (!courseId || !uniqueID || !image || !qrCodeImage) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { name: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    const certificate = await prisma.certificate.create({
      data: {
        courseId: course.id,
        uniqueID: uniqueID,
      },
      include: { course: true },
    });

    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext("2d");

    // Load the uploaded image as the background
    const uploadedImage = await loadImage(image);
    ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);

    // Load and overlay the QR code on the top-left corner
    const qrCodeImg = await loadImage(qrCodeImage);
    const padding = 10;
    ctx.drawImage(qrCodeImg, padding, padding);

    const finalImage = canvas.toDataURL("image/png");

    return NextResponse.json({ finalImage, certificate });
  } catch (error) {
    console.error("Error generating ID:", error);
    return NextResponse.json({ error: "Failed to generate ID." }, { status: 500 });
  }
}
