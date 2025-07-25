import { useEffect, useState } from "react";
import axios from "axios"; // Keeping axios as requested
import { Link } from 'react-router-dom'; // Import Link for navigation

interface Course {
  _id: string; // Assuming _id exists for the key prop
  name: string; // Used for linking in the URL
  serialno: string;
  duration: string;
  eligibility: string;
  coursefee: string;
  schilarship: string;
  details: string;
}

const BACKEND_URL = 'http://localhost:5000'; // Keeping BACKEND_URL as requested

// Common image URL for all course cards
const DEFAULT_COURSE_IMAGE = "./simms.png"; // Updated to the specified path

export default function AllCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State to store error messages

  // Define fetchCourses outside useEffect so it can be called by retry button
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors

      const res = await axios.get<Course[]>(`${BACKEND_URL}/api/courses`); // Keeping direct axios call
      setCourses(res.data);
    } catch (err: unknown) { // Using unknown for better type safety
      console.error("Failed to fetch courses:", err);
      if (axios.isAxiosError(err)) { // Check if it's an Axios error
        // Attempt to get a more specific error message from the backend response
        setError(`Failed to fetch courses: ${err.response?.data?.message || err.message}. Please try again later.`);
      } else if (err instanceof Error) {
        setError(`An unexpected error occurred: ${err.message}. Please check your network connection.`);
      } else {
        setError('An unknown error occurred while fetching courses.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Call fetchCourses on component mount
  useEffect(() => {
    fetchCourses();
  }, []); // Empty dependency array means it runs once on mount

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button onClick={fetchCourses} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 mt-20"> {/* Added mt-20 for spacing from navbar */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">All Courses</h1>
      {courses.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No courses available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            // Wrap the entire card with Link to its detail page
            <Link 
              key={course._id} 
              to={`/courses/${encodeURIComponent(course.name)}`} // Link using course name
              className="block" // Make the Link take up the full card area
            >
              <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200 ease-in-out h-full flex flex-col">
                {/* Common Image for the Course Card */}
                <img 
                  src={DEFAULT_COURSE_IMAGE} 
                  alt={`Image for ${course.name}`} 
                  className="w-full h-32 object-cover rounded-md mb-4" // Responsive image styling
                  onError={(e) => { e.currentTarget.src = "https://placehold.co/400x200/cccccc/000000?text=Image+Error"; }} // Fallback on error
                />

                <h2 className="text-xl font-semibold text-blue-700 mb-3">{course.name}</h2>
                <div className="space-y-1 text-gray-700 text-sm flex-grow"> {/* flex-grow to push details down */}
                  <p><strong>Serial No:</strong> {course.serialno}</p>
                  <p><strong>Duration:</strong> {course.duration}</p>
                  <p><strong>Eligibility:</strong> {course.eligibility || "N/A"}</p>
                  <p><strong>Course Fee:</strong> ₹{course.coursefee}</p>
                  <p><strong>Scholarship:</strong> {course.schilarship}</p>
                </div>
                {course.details && <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-3">{course.details}</p>}
                {/* Add a "View Details" button for clear CTA */}
                <div className="mt-4 text-right">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    View Details
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}