"use client";
import { useState, useEffect } from "react";
import AdminSideBar from "@/components/AdminSideBar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import LoadingPage from "@/components/LoadingPage";  

export default function ManageCourses() {
    const [token, setToken] = useState(null);
    const [courses, setCourses] = useState([]);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState("");
    const [courseData, setCourseData] = useState({
        courseName: "",
        courseDescription: "",
        coursePrice: 0,
    });
    const [isLoading, setIsLoading] = useState(true); 

    // Modal state for add and edit
    const [showAddCourseModal, setShowAddCourseModal] = useState(false);
    const [editCourse, setEditCourse] = useState(null);

    // Input handlers
    const handleChangeInput = (e) => {
        setCourseData({ ...courseData, [e.target.name]: e.target.value });
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        const { courseName, courseDescription, coursePrice } = courseData;
        const price = parseFloat(coursePrice); // Convert to number

        try {
            const response = await fetch("/api/admin/courses", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: courseName,
                    description: courseDescription,
                    price: price,
                }),
            });

            if (response.ok) {
                const newCourse = await response.json();
                setCourses((prevCourses) => [...prevCourses, newCourse]);
                setStatusMessage("Course added successfully!");
                setStatusType("success");
                setCourseData({ courseName: "", courseDescription: "", coursePrice: 0 });
                setShowAddCourseModal(false); // Close modal after adding
            } else {
                const errorData = await response.json();
                setStatusMessage("Failed to add course: " + errorData.error);
                setStatusType("error");
            }
        } catch (error) {
            console.error("Error adding course", error);
            setStatusMessage("An unexpected error occurred.");
            setStatusType("error");
        }
    };

    const handleEditCourse = async (e) => {
        e.preventDefault(); 
    
        const { courseName, courseDescription, coursePrice } = courseData;
        const price = parseFloat(coursePrice);
    
        if (isNaN(price)) {
            setStatusMessage("Invalid price value.");
            setStatusType("error");
            return;
        }
    
        try {
            const response = await fetch(`/api/admin/courses/${editCourse.id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: courseName,
                    description: courseDescription,
                    price: price,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setCourses(courses.map((course) => 
                    course.id === editCourse.id ? data : course
                ));
                setStatusMessage("Course updated successfully!");
                setStatusType("success");
                setCourseData({ courseName: "", courseDescription: "", coursePrice: 0 });
                setEditCourse(null); // Close modal after editing
            } else {
                setStatusMessage("Failed to update course: " + data.error);
                setStatusType("error");
            }
        } catch (error) {
            console.error("Error updating course", error);
            setStatusMessage("An unexpected error occurred.");
            setStatusType("error");
        }
    };
    
    
    const handleDeleteCourse = async (id) => {
        e.preventDefault();
        if (!confirm("Are you sure you want to delete this course?")) return;
    
        try {
            const response = await fetch(`/api/admin/courses/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setCourses(courses.filter(course => course.id !== id));
                setStatusMessage("Course deleted successfully!");
                setStatusType("success");
            } else {
                setStatusMessage("Failed to delete course: " + data.error);
                setStatusType("error");
            }
        } catch (error) {
            console.error("Error deleting course", error);
            setStatusMessage("An unexpected error occurred.");
            setStatusType("error");
        }
    };
    

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        if (!token) return;

        const fetchCourses = async () => {
            setIsLoading(true); 
            try {
                const response = await fetch("/api/admin/courses", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCourses(data);
                } else {
                    console.error("Failed to fetch courses");
                }
            } catch (error) {
                console.error("Error fetching courses", error);
            } finally {
                setIsLoading(false); 
            }
        };

        fetchCourses();
    }, [token]);

    return (
        <>
            <div className="flex flex-row w-full">
                <AdminSideBar />
                <div className="flex flex-col items-center justify-center w-10/12 min-h-screen p-5 bg-white">
                    <div className="flex justify-between w-full py-3 border-b-2">
                        <h1 className="text-2xl font-medium">Manage Courses</h1>
                    </div>
                    <div className="flex justify-end w-full">
                        <button
                            onClick={() => setShowAddCourseModal(true)}
                            className="p-2 my-2 bg-yellow-200 rounded text-red-950 hover:bg-yellow-300"
                        >
                            <FontAwesomeIcon icon={faPlus} /> Add Course
                        </button>
                    </div>

                    {showAddCourseModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
                            <div className="p-5 bg-white rounded">
                                <h2 className="text-xl font-medium">{editCourse ? 'Edit' : 'Add'} Course</h2>
                                <form onSubmit={editCourse ? handleEditCourse : handleAddCourse}>
                                    <input
                                        type="text"
                                        name="courseName"
                                        value={courseData.courseName}
                                        onChange={handleChangeInput}
                                        placeholder="Course Name"
                                        className="w-full p-2 my-2 border rounded"
                                    />
                                    <textarea
                                        name="courseDescription"
                                        value={courseData.courseDescription}
                                        onChange={handleChangeInput}
                                        placeholder="Course Description"
                                        className="w-full p-2 my-2 border rounded"
                                    />
                                    <input
                                        type="number"
                                        name="coursePrice"
                                        value={courseData.coursePrice}
                                        onChange={handleChangeInput}
                                        placeholder="Course Price"
                                        className="w-full p-2 my-2 border rounded"
                                    />
                                    <button
                                        type="submit"
                                        className="p-2 mt-2 text-white bg-green-500 rounded"
                                    >
                                        Confirm {editCourse ? 'Edit' : 'Add'}
                                    </button>
                                    <button
                                        onClick={() => { setShowAddCourseModal(false); setEditCourse(null); }}
                                        className="p-2 mt-2 ml-2 text-white bg-red-500 rounded"
                                    >
                                        Cancel
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {statusMessage && (
                        <p
                            className={`mt-4 text-center ${statusType === "success" ? "text-green-600" : "text-red-600"}`}
                        >
                            {statusMessage}
                        </p>
                    )}

                    {isLoading ? (
                        <LoadingPage />
                    ) : (
                        <div className="w-full">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="p-2 border">Course Name</th>
                                        <th className="p-2 border">Description</th>
                                        <th className="p-2 border">Price (PHP)</th>
                                        <th className="p-2 border">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.length > 0 ? (
                                        courses.map((course) => (
                                            <tr key={course.id}>
                                                <td className="p-2 border">{course.name}</td>
                                                <td className="p-2 border">{course.description}</td>
                                                <td className="p-2 border">{course.price}</td>
                                                <td className="p-2 border">
                                                    <button
                                                        onClick={() => { setEditCourse(course); setCourseData({ courseName: course.name, courseDescription: course.description, coursePrice: course.price }); setShowAddCourseModal(true); }}
                                                        className="p-2 text-sm bg-yellow-200 rounded text-red-950 hover:bg-yellow-300"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCourse(course.id)}
                                                        className="p-2 text-sm text-yellow-200 rounded bg-red-950"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-2 text-center">No courses available.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
