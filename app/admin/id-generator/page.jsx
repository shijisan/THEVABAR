"use client";

import { useEffect, useState } from "react";
import AdminSideBar from "@/components/AdminSideBar";
import QRCode from "qrcode"; // New QR code library

export default function IDGenerator() {
  const [image, setImage] = useState(null); // Stores uploaded image
  const [imageWithID, setImageWithID] = useState(null); // Stores final certificate image with QR code
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // Store the uploaded image as Base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateID = async () => {
    if (!selectedCourse) {
      alert("Please select a course.");
      return;
    }

    if (!image) {
      alert("Please upload a certificate image.");
      return;
    }

    try {
      const courseNamePrefix = selectedCourse.replace(/\s+/g, "").toUpperCase();
      const uniqueID = `${courseNamePrefix}-${Date.now()}`;

      // Generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL(uniqueID, {
        width: 150,  // Size of the QR code
        margin: 2,   // QR code margin
      });

      // Send data to the backend
      const response = await fetch("/api/admin/id-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: selectedCourse,
          uniqueID,
          image, // Certificate background image
          qrCodeImage: qrCodeDataUrl, // QR code to overlay
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setImageWithID(data.finalImage); // Final image with QR code
        setCertificate(data.certificate);
      } else {
        alert(data.error || "Failed to generate ID.");
      }
    } catch (error) {
      console.error("Error generating ID:", error);
      alert("An error occurred while generating the ID.");
    }
  };

  return (
    <main className="flex">
      <AdminSideBar />
      <div className="flex items-center justify-center w-10/12">
        <div className="w-full max-w-sm p-6 bg-white border rounded-lg shadow border-neutral-300">
          <h1 className="mb-4 text-3xl font-medium text-center">ID Generator</h1>
          <p className="mb-4 text-sm text-center text-neutral-600">
            Select a course and upload an image to generate an ID with the course name.
          </p>

          <div className="flex flex-col items-center mb-4">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-[99%] px-4 py-2 mb-4 text-sm bg-gray-100 border rounded-md"
            >
              <option value="" disabled>
                Select a course
              </option>
              {courses.length > 0 &&
                courses.map((course) => (
                  <option key={course.id} value={course.name}>
                    {course.name}
                  </option>
                ))}
            </select>

            <input
              type="file"
              accept="image/*"
              className="mb-4"
              onChange={handleFileChange}
            />
            <button
              onClick={handleGenerateID}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700"
            >
              Generate ID
            </button>
          </div>

          {imageWithID && (
            <div className="mt-6">
              <h2 className="mb-2 text-lg font-medium text-center">Result</h2>
              <img
                src={imageWithID}
                alt="Image with ID"
                className="w-full border rounded-lg border-neutral-300"
              />
            </div>
          )}

          {certificate && (
            <div className="mt-6">
              <h2 className="mb-2 text-lg font-medium text-center">
                Certificate Details
              </h2>
              <div className="text-center">
                <p>
                  <strong>Course:</strong> {certificate.course.name}
                </p>
                <p>
                  <strong>Unique ID:</strong> {certificate.uniqueID}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
