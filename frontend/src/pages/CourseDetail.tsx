import React, { useState, useEffect } from 'react'; // Removed useCallback import
import { useParams, Link } from 'react-router-dom';
import axios from 'axios'; // Keeping axios as requested

// Define the Course interface directly in this file, mirroring your backend schema
interface Course {
  _id: string;
  name: string;
  serialno: string;
  duration: string;
  eligibility: string;
  coursefee: string;
  schilarship: string; // Keeping the typo 'schilarship' as per your provided code
  details: string;
}

const BACKEND_URL = 'http://localhost:5000'; // Keeping BACKEND_URL as requested

const CourseDetail: React.FC = () => {
  // Extract courseName from URL parameters
  const { courseName } = useParams<{ courseName: string }>(); 
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Define the fetch function directly inside useEffect
    const fetchCourseDetails = async () => {
      setLoading(true);
      setError(null);
      if (!courseName) { // Ensure courseName exists before attempting to fetch
        setError('Course name is missing from the URL.');
        setLoading(false);
        return;
      }
      try {
        // Decode the course name from the URL to handle spaces and special characters
        const decodedCourseName = decodeURIComponent(courseName);
        // Fetch course details by name from the backend
        const res = await axios.get<Course>(`${BACKEND_URL}/api/courses/name/${decodedCourseName}`); 
        setCourse(res.data);
      } catch (err: unknown) {
        console.error(`Failed to fetch course details for Name "${courseName}":`, err);
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setError('Course not found.');
          } else {
            setError(`Failed to load course: ${err.response?.data?.message || err.message}`);
          }
        } else if (err instanceof Error) {
          setError(`An unexpected error occurred: ${err.message}`);
        } else {
          setError('An unknown error occurred while fetching course details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails(); // Call the function

  }, [courseName]); // Only dependency is courseName, as fetchCourseDetails now depends only on it.

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading course details...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <Link to="/courses" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Back to All Courses
          </Link>
        </div>
      </div>
    );
  }

  // Render "Course Not Found" if course is null after loading and no error
  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Course Not Found</h2>
          <p className="text-gray-700">The course you are looking for does not exist.</p>
          <Link to="/courses" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Back to All Courses
          </Link>
        </div>
      </div>
    );
  }

  // Render course details
  return (
    <div className="container mx-auto p-6 mt-20 md:mt-24 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4 text-center">{course.name}</h1>
        <p className="text-lg text-gray-600 mb-6 text-center">Serial No: <span className="font-semibold">{course.serialno}</span></p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="info-box bg-blue-50 p-4 rounded-md border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Key Information</h3>
            <p className="text-gray-700"><strong>Duration:</strong> {course.duration}</p>
            <p className="text-gray-700"><strong>Eligibility:</strong> {course.eligibility || "N/A"}</p>
            <p className="text-gray-700"><strong>Course Fee:</strong> ₹{course.coursefee}</p>
            <p className="text-gray-700"><strong>Scholarship:</strong> {course.schilarship}</p>
          </div>
          <div className="info-box bg-green-50 p-4 rounded-md border border-green-200">
            <h3 className="text-xl font-semibold text-green-800 mb-2">Detailed Description</h3>
            <p className="text-gray-800 leading-relaxed">{course.details}</p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/courses" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <svg className="-ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H16a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to All Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;