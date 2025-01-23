"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function CourseApplicationContent() {
	const [course, setCourse] = useState(null);
	const [email, setEmail] = useState("");
	const [fbAccountLink, setFbAccountLink] = useState("");
	const [proofOfPayment, setProofOfPayment] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);

	const searchParams = useSearchParams();
	const courseId = searchParams.get("courseId");
	const router = useRouter();

	useEffect(() => {
		if (courseId) {
			const fetchCourse = async () => {
				try {
					const response = await fetch(`/api/courses/${courseId}`);
					if (!response.ok) throw new Error("Failed to fetch course");
					const data = await response.json();
					setCourse(data);
				} catch (err) {
					console.error(err);
				}
			};

			fetchCourse();
		}
	}, [courseId]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!email || !fbAccountLink || !proofOfPayment) {
			setError("Please fill in all required fields.");
			return;
		}

		const formData = new FormData();
		formData.append("courseId", courseId);
		formData.append("email", email);
		formData.append("fbAccountLink", fbAccountLink);
		formData.append("proofOfPayment", proofOfPayment);

		setIsSubmitting(true);
		setError(null);

		try {
			const response = await fetch("/api/applications", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) throw new Error("Failed to submit application");

			router.push("/application/success");
		} catch (err) {
			console.error(err);
			setError("Submission failed. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!courseId) return <div>Loading...</div>;

	return (
		<form onSubmit={handleSubmit} className="flex flex-col w-1/3 p-5 space-y-3 bg-white border rounded-lg shadow">
			<h1 className="text-3xl font-medium text-center">Course Application</h1>
			{course && (
				<>
					<div className="flex flex-col">
						<label htmlFor="course">Course:</label>
						<input className="p-2 border rounded" type="text" name="course" value={course.name} disabled />
					</div>
					<p>Price: {course.price}</p>

					<div className="flex flex-col">
						<label htmlFor="email">Your Email:</label>
						<input
							className="p-2 border rounded"
							type="email"
							name="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<div className="flex flex-col">
						<label htmlFor="fbAccountLink">Facebook Account Link:</label>
						<input
							className="p-2 border rounded"
							type="text"
							name="fbAccountLink"
							placeholder="https://www.facebook.com/your-profile"
							value={fbAccountLink}
							onChange={(e) => setFbAccountLink(e.target.value)}
							required
						/>
					</div>

					<div className="flex flex-col">
						<label htmlFor="proofOfPayment">Proof of Payment (Screenshot):</label>
						<ul className="mb-2 list-disc list-inside ps-4">
							<li>091234567890 - John D. Doe</li>
							<li>090123456789 - John E. Doe</li>
							<li>090912345678 - John F. Doe</li>
						</ul>
						<input
							type="file"
							name="proofOfPayment"
							onChange={(e) => setProofOfPayment(e.target.files[0])}
							required
						/>
					</div>


					{error && <p className="text-red-500">{error}</p>}

						<button
							type="submit"
							className="p-2 bg-yellow-200 rounded shadow text-red-950 hover:bg-yellow-300"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Submitting..." : "Submit"}
						</button>
				</>
			)}
		</form>
	);
}

export default function CourseApplicationPage() {
	return (
		<div className="flex items-center justify-center w-full min-h-screen">
			<CourseApplicationContent />
		</div>
	);
}
