"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";

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
		<main className="pt-[10vh]">
			<h1 className="my-6 text-3xl font-semibold text-center">Available Courses</h1>
			{courses.length === 0 ? (
				<LoadingPage/>
			) : (
				<div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
					{courses.map((course) => (
						<div key={course.id} className="flex flex-col h-full p-4 bg-white border rounded-lg shadow">
							<div className="flex-grow">
								<h2 className="text-xl font-semibold">{course.name}</h2>
								<p className="mb-2 text-sm">Price: &#8369;{course.price}</p>
								<p className="text-sm">{course.description}</p>
							</div>
							<button
								onClick={() => handleApply(course.id)}
								className="p-2 mt-4 text-white bg-blue-500 rounded justify-self-end hover:bg-blue-600"
							>
								Apply for this Course
							</button>
						</div>
					))}
				</div>
			)}
		</main>
	);
}
