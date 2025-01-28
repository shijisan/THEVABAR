"use client"

import { Suspense, useState, useEffect } from "react";
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

	// Only fetch course data when on the client side
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
		<>
			<main className="flex flex-col items-center justify-center min-h-screen pt-[10vh]">

				<form onSubmit={handleSubmit} className="flex flex-col w-full max-w-sm p-4 space-y-3 bg-white border rounded-lg shadow border-neutral-300">
					<h1 className="text-3xl font-medium text-center">Course Application</h1>
					{course && (
						<>
							<p className="text-sm">Course: <span className="text-base">{course.name}</span></p>
							<p className="text-sm">Price: <span className="text-base">&#8369;{course.price}</span></p>

							<div className="flex flex-col">
								<label htmlFor="email" className="text-sm">Email:</label>
								<input
									className="p-2 border rounded border-neutral-300"
									type="email"
									name="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="test@gmail.com"
									required
								/>
							</div>

							<div className="flex flex-col">
								<label htmlFor="fbAccountLink" className="text-sm">Facebook Account Link:</label>
								<input
									className="p-2 border rounded border-neutral-300"
									type="text"
									name="fbAccountLink"
									placeholder="Your public Facebook account here..."
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

			</main>
		</>
	);
}

export default function CourseApplicationPage() {
	return (
		<div className="flex items-center justify-center w-full min-h-screen">
			<Suspense fallback={<div>Loading Course Data...</div>}>
				<CourseApplicationContent />
			</Suspense>
		</div>
	);
}
