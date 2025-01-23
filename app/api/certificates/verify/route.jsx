import { NextResponse } from "next/server";
import { createCanvas, loadImage } from "canvas";
import jsQR from "jsqr";  // Reverting to jsQR for decoding QR codes
import prisma from "@/lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("certificate");

    if (!file) {
      return NextResponse.json(
        { error: "Certificate file is missing." },
        { status: 400 }
      );
    }

    // Read and process the image
    const imageBuffer = await file.arrayBuffer();
    const image = await loadImage(Buffer.from(imageBuffer));

    // Resize the image to 800px width, maintaining aspect ratio
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Extract raw pixel data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Attempt to decode the QR code using jsQR
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (!code) {
      return NextResponse.json(
        { error: "No QR code found on the certificate." },
        { status: 400 }
      );
    }

    const qrCodeData = code.data;

    // Verify if the QR code corresponds to a valid certificate in the database
    const certificate = await prisma.certificate.findUnique({
      where: { uniqueID: qrCodeData },
    });

    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate is invalid or not recognized." },
        { status: 400 }
      );
    }

    // Return the certificate data upon successful verification
    return NextResponse.json({
      message: "Certificate verified successfully.",
      data: certificate,  // Return the entire certificate data
    });
  } catch (error) {
    console.error("Error verifying certificate:", error);
    return NextResponse.json(
      { error: "An error occurred while verifying the certificate." },
      { status: 500 }
    );
  }
}
