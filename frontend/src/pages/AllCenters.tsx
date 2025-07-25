import { useEffect, useState } from "react";
import axios from "axios"; // Keeping axios as requested
// Removed: import { Link } from 'react-router-dom'; // No longer needed if not navigating on click

interface Center {
  _id: string;
  name: string;
  address: string;
  centercode: string; // Used for linking, but not directly clickable now
  qualification: string;
  seatingcapacity: string;
  strength: string;
  noofsystem: string;
  noofclassroom: string;
  office: string;
  receptiondesk: string;
  toilet: string;
  religion: string;
  website?: string;
  Contactno: string;
}

const BACKEND_URL = 'http://localhost:5000'; // Define BACKEND_URL

export default function CenterList() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State to store error messages

  const fetchCenters = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors

      const res = await axios.get<Center[]>(`${BACKEND_URL}/api/center`); // Keeping direct axios call
      setCenters(res.data);
    } catch (err: unknown) { // Using unknown for better type safety
      console.error("Failed to fetch centers:", err);
      if (axios.isAxiosError(err)) { // Check if it's an Axios error
        setError(`Failed to fetch centers: ${err.response?.data?.message || err.message}. Please try again later.`);
      } else if (err instanceof Error) {
        setError(`An unexpected error occurred: ${err.message}. Please check your network connection.`);
      } else {
        setError('An unknown error occurred while fetching centers.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading centers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button onClick={fetchCenters} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-10 text-center">Affiliated Centers</h1>

        {centers.length === 0 ? (
          <p className="text-center text-gray-600 text-xl py-10">No centers found at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {centers.map((center) => (
              // Removed the Link wrapper. The div is now just a display element.
              <div 
                key={center._id} 
                // Removed 'block group' classes as it's no longer a link
                className="bg-white shadow-xl rounded-xl p-6 border border-gray-200 
                           transform transition-all duration-300 ease-in-out 
                           hover:scale-105 hover:shadow-2xl h-full flex flex-col cursor-default" // Added cursor-default
              >
                
                <h3 className="text-2xl font-bold text-blue-700 mb-3 leading-tight">{center.name}</h3>
                
                <div className="space-y-2 text-gray-700 text-base flex-grow">
                  <p><strong>Code:</strong> {center.centercode}</p>
                  <p><strong>Address:</strong> {center.address}</p>
                  <p><strong>Contact:</strong> {center.Contactno}</p>
                  {center.website && (
                    <p>
                      <strong>Website:</strong> <span className="text-blue-500">{center.website}</span> {/* Removed hover:underline as it's not a link */}
                    </p>
                  )}
                  <p><strong>Qualification:</strong> {center.qualification || "N/A"}</p>
                  <p><strong>Seating Capacity:</strong> {center.seatingcapacity}</p>
                  <p><strong>Strength:</strong> {center.strength}</p>
                  <p><strong>No. of Systems:</strong> {center.noofsystem || "N/A"}</p>
                  <p><strong>No. of Classrooms:</strong> {center.noofclassroom || "N/A"}</p>
                  <p><strong>Office:</strong> {center.office || "N/A"}</p>
                  <p><strong>Reception Desk:</strong> {center.receptiondesk || "N/A"}</p>
                  <p><strong>Toilet:</strong> {center.toilet || "N/A"}</p>
                  <p><strong>Religion Facility:</strong> {center.religion || "N/A"}</p>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}