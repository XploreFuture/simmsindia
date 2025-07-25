import { useEffect, useState } from "react";
import axios from "axios"; // Keeping axios as requested
import { Link } from 'react-router-dom'; // Import Link for navigation

interface Course {
  _id: string; // Assuming _id exists for the key prop
  name: string; // Used for linking
  serialno: string;
  duration: string;
  eligibility: string;
  coursefee: string;
  schilarship: string;
  details: string;
}

const BACKEND_URL = 'http://localhost:5000'; // Keeping BACKEND_URL as requested

const images = [
  "/slide/image1.png",
  "/slide/image2.png",
  "/slide/image3.png",
  "/slide/image4.png",
  "/slide/image5.png",
  "/slide/image6.png"
];

// Common image URL for all course cards

// Image for the "About Our Institution" section
const ABOUT_US_IMAGE = "./slide/image2.png"; // Replace with your actual image path

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  // Hero Carousel Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Fetch Courses function - Defined outside useEffect so it can be called by retry button
  const fetchCourses = async () => {
    setLoadingCourses(true);
    setCoursesError(null);
    try {
      const res = await axios.get<Course[]>(`${BACKEND_URL}/api/courses`);
      setCourses(res.data);
    } catch (err: unknown) {
      console.error("Failed to fetch courses:", err);
      if (axios.isAxiosError(err)) {
        setCoursesError(`Failed to load courses: ${err.response?.data?.message || err.message}`);
      } else if (err instanceof Error) {
        setCoursesError(`An unexpected error occurred: ${err.message}`);
      } else {
        setCoursesError('An unknown error occurred while fetching courses.');
      }
    } finally {
      setLoadingCourses(false);
    }
  };

  // Call fetchCourses on component mount
  useEffect(() => {
    fetchCourses();
  }, []); // Empty dependency array means it runs once on mount

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans">
      {/* Hero Carousel */}
      <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Slide ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              idx === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
            Welcome to SIMMS INDIA
          </h1>
          <p className="text-white text-lg md:text-xl mt-4 max-w-2xl drop-shadow-md">
            Empowering futures through quality education and skill development.
          </p>
        </div>
        {/* Carousel Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                idx === current ? "bg-blue-500" : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      </div>

      {/* Course Catalog */}
      <section className="py-16 px-4 md:px-8 bg-pink-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Popular Courses</h2>
          {loadingCourses ? (
            <p className="text-center text-gray-600">Loading courses...</p>
          ) : coursesError ? (
            <div className="text-center text-red-600 p-4 bg-red-100 rounded-md">
              <p>{coursesError}</p>
              <button onClick={fetchCourses} className="mt-2 text-blue-700 hover:underline">Retry Loading Courses</button>
            </div>
          ) : courses.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">No courses available at the moment.</p>
          ) : (
            <div className="flex overflow-x-auto space-x-6 pb-6 pt-2 hide-scrollbar">
              {courses.map((course) => (
                // Adjusted width and height to 250px for square size
                <Link
                  key={course._id}
                  to={`/courses/${encodeURIComponent(course.name)}`}
                  className="group w-[270px] h-[300px] flex-shrink-0 bg-white shadow-xl rounded-xl p-5 border border-green-300
                             transform transition-all duration-300 hover:scale-105 hover:shadow-2xl block"
                >
                  <h3 className="font-bold text-xl text-blue-700 mb-2 truncate">{course.name}</h3>
                   {/* <p className="text-sm text-gray-700"><strong>Serial No:</strong> {course.serialno}</p> */}
<p className="text-sm text-gray-700"><strong>Duration:</strong> {course.duration}</p>

 <p className="text-sm text-gray-700"><strong>Course Fee:</strong> ₹{course.coursefee}</p>

<p className="text-sm text-gray-700"><strong>Eligibility:</strong> {course.eligibility || "N/A"}</p>

 <p className="text-sm text-gray-700"><strong>Scholarship:</strong> {course.schilarship}</p>
                  <p className="text-xs text-gray-600 mt-3 line-clamp-3 group-hover:line-clamp-none transition-all duration-300 ease-in-out">
                    {course.details}
                  </p>
                  {/* Optional: Add a "View Details" button inside the card for clear CTA */}
                  <div className="mt-auto text-right">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      View Details
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About the Institution Section */}
      <section className="py-16 px-4 md:px-8 bg-white shadow-inner">
        <div className="max-w-4xl mx-auto bg-blue-50 p-8 rounded-xl shadow-lg border border-blue-200">
          {/* Added Image */}
          <img
            src={ABOUT_US_IMAGE}
            alt="About Our Institution"
            className="w-full h-48 object-cover rounded-lg mb-6 shadow-md"
            onError={(e) => { e.currentTarget.src = "https://placehold.co/600x300/cccccc/000000?text=About+Us+Image+Error"; }} // Fallback
          />
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">About Our Institution</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            SIMMS INDIA is a forward-thinking institution dedicated to excellence in skill development and career readiness. With a wide array of certified programs and strong industry partnerships, we aim to shape the leaders of tomorrow. Our experienced faculty and state-of-the-art infrastructure are designed to provide a supportive and dynamic learning environment that nurtures individual talent and drives innovation. Join us to unlock your full potential and achieve your career aspirations.
          </p>
        </div>
      </section>

      {/* Director's Message Section */}
      <section className="py-16 px-4 md:px-8 bg-gray-100">
        <div className="max-w-4xl mx-auto bg-blue-50 p-8 rounded-xl shadow-lg border border-blue-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Director’s Message</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Welcome to our institution. At SIMMS INDIA, we are committed to building a brighter future through education, innovation, and leadership. Our mission is to empower students with knowledge and values that last a lifetime, fostering a community of lifelong learners and responsible global citizens. We believe in nurturing talent and providing a supportive environment for holistic growth.
          </p>
        </div>
      </section>


      {/* Custom CSS for hiding scrollbar */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
}
