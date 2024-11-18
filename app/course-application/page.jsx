"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function CourseApplicationContent() {
  const [course, setCourse] = useState(null);
  const [batch, setBatch] = useState("");
  const [fbAccountLink, setFbAccountLink] = useState("");
  const [proofOfPayment, setProofOfPayment] = useState(null);

  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  useEffect(() => {
    if (courseId) {
      const fetchCourse = async () => {
        try {
          const response = await fetch(`/api/courses/${courseId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch course");
          }
          const data = await response.json();
          setCourse(data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchCourse();
    }
  }, [courseId]);

  if (!courseId) {
    return <div>Loading...</div>;
  }

  return (
    <form className="flex flex-col w-1/3 p-5 space-y-3 bg-white border rounded-lg shadow">
      <h1 className="text-3xl font-medium text-center">Course Application</h1>
      {course && (
        <>
          <div className="flex flex-col">
            <label htmlFor="course">Course:</label>
            <select className="p-2 border rounded" name="course" id="course" defaultValue={course.name} disabled>
              <option value={course.name}>{course.name}</option>
            </select>
          </div>
          <p>Price: {course.price}</p>

          <div className="flex flex-col">
            <label htmlFor="batch">Batch:</label>
            <select
              className="p-2 border rounded"
              name="batch"
              id="batch"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
            >
              <option value="1">Batch 1</option>
              <option value="2">Batch 2</option>
              <option value="3">Batch 3</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="fbAccountLink">Your Facebook Account Link:</label>
            <input
              className="p-2 border rounded"
              type="text"
              name="fbAccountLink"
              id="fbAccountLink"
              placeholder="https://www.facebook.com/profile.php?id=0"
              value={fbAccountLink}
              onChange={(e) => setFbAccountLink(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="proofOfPayment">Proof of Payment (Screenshot)</label>
            <input
              type="file"
              name="proofOfPayment"
              id="proofOfPayment"
              onChange={(e) => setProofOfPayment(e.target.files[0])}
            />
          </div>

          <div className="flex items-center justify-center w-full">
            <button type="submit" className="p-2 bg-yellow-200 rounded shadow text-red-950 hover:bg-yellow-300">
              Submit
            </button>
          </div>
        </>
      )}
    </form>
  );
}

export default function CourseApplicationPage() {
  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <Suspense fallback={<div>Loading Course Application...</div>}>
        <CourseApplicationContent />
      </Suspense>
    </div>
  );
}
