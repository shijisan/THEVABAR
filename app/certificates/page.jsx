"use client";

import { FaCheckCircle } from "react-icons/fa";

import { useState } from "react";

export default function Certificates() {
	const [loading, setLoading] = useState(false);
	const [certificateData, setCertificateData] = useState(null); // To hold the certificate data

	const handleFileChange = async (e) => {
		const file = e.target.files[0];

		if (!file) {
			alert("Please upload a certificate.");
			return;
		}

		const formData = new FormData();
		formData.append("certificate", file);

		setLoading(true);

		try {
			const response = await fetch("/api/certificates/verify", {
				method: "POST",
				body: formData,
			});

			const data = await response.json();

			if (response.ok) {
				alert(data.message || "Certificate verified successfully!");
				console.log("QR Code Data:", data.data);
				setCertificateData(data.data);
			} else {
				alert(data.error || "Certificate verification failed.");
			}
		} catch (error) {
			console.error("Error verifying certificate:", error);
			alert("An error occurred while verifying the certificate.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="flex items-center justify-center w-full min-h-screen">
			<div className="max-w-6xl">
				<form
					className="w-full max-w-sm p-6 text-gray-800 bg-white border border-gray-300 rounded-lg shadow"
					onSubmit={(e) => e.preventDefault()}
				>
					<h1 className="mb-3 text-3xl font-medium text-center">
						<span className="text-yellow-400">Verify</span> Your Certificate
					</h1>
					<p className="mb-3 text-sm text-justify text-gray-700">
						TVB Academy issues certificates upon course completion. Verify your
						certificate by uploading its image to ensure its authenticity.
					</p>
					<div className="relative mb-4">
						<p className="mb-2 text-sm font-medium">Upload your certificate:</p>
						<label
							htmlFor="certificate"
							className={`block px-4 py-2 text-center text-white bg-yellow-400 rounded-full cursor-pointer ${loading ? "cursor-wait bg-yellow-300" : "hover:bg-yellow-500"
								}`}
						>

							{loading ? "Verifying..." :
								<>
									<FaCheckCircle className="inline-flex me-1" /> Select Certificate
								</>
							}
						</label>
						<input
							type="file"
							name="certificate"
							id="certificate"
							className="hidden"
							accept="image/*"
							onChange={handleFileChange}
							disabled={loading}
						/>
					</div>
					<p className="text-xs text-center text-gray-500">
						Note: Only certificates issued by TVB Academy are supported.
					</p>
				</form>

				{certificateData && (
					<div className="p-4 mt-8 bg-white border rounded-lg shadow">
						<h2 className="text-xl font-semibold">Certificate Details</h2>
						<p><strong>Unique ID:</strong> {certificateData.uniqueID}</p>
						<p><strong>Course ID:</strong> {certificateData.courseId}</p>
						<p><strong>Issued On:</strong> {new Date(certificateData.createdAt).toLocaleDateString()}</p>
					</div>
				)}
			</div>
		</main>
	);
}

