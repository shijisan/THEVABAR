"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CoursesPage() {
	const [courses, setCourses] = useState([]);
	const router = useRouter();

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const response = await fetch("/api/courses"); // Fetch all courses
				if (!response.ok) {
					throw new Error("Failed to fetch courses");
				}
				const data = await response.json();
				setCourses(data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchCourses();
	}, []);

	const handleApply = (courseId) => {
		router.push(`/course-application?courseId=${courseId}`); 
	};

	return (
		<div className="container p-4 mx-auto">
			<h1 className="mb-6 text-3xl font-bold text-center">Available Courses</h1>
			{courses.length === 0 ? (
				<p>Loading courses...</p>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{courses.map((course) => (
						<div key={course.id} className="p-4 bg-white border rounded-lg shadow-lg">
							<h2 className="text-xl font-semibold">{course.name}</h2>
							<p>Price: {course.price}</p>
							<button
								onClick={() => handleApply(course.id)}
								className="p-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
							>
								Apply for this Course
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
