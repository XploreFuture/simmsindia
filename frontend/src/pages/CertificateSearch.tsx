import React, { useState } from 'react';
import { fetchWithAuth } from '../utils/api'; // Import your fetchWithAuth utility

// Define the Certificate interface more comprehensively
interface Certificate {
  _id: string;
  name: string; // Student's full name
  fathername: string;
  mothername: string;
  course: string;
  registrationno: string; // The unique ID used for searching
  Address: string;
  centername: string;
  grade: string;
  issueDate?: string; // Assuming a date string for certificate issue date
  certificateId?: string; // A unique ID for the certificate itself, if different from _id
  // Add any other fields from your backend's Certificate model here
}

// Removed: const BACKEND_URL = 'http://localhost:5000'; // No longer needed here

const CertificateSearch: React.FC = () => {
  const [searchRegNo, setSearchRegNo] = useState('');
  const [searchResult, setSearchResult] = useState<Certificate | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    setMessage(null); // Clear previous messages
    setSearchResult(null); // Clear previous results
    setLoading(true); // Set loading state

    if (!searchRegNo.trim()) {
      setMessage({ type: 'error', text: 'Please enter a registration number to search.' });
      setLoading(false);
      return;
    }

    try {
      // Use fetchWithAuth with only the relative path
      // fetchWithAuth will prepend the BASE_API_URL defined in utils/api.ts
      const data = await fetchWithAuth<Certificate>(`/api/certificates/${searchRegNo}`); 
      
      if (data) {
        setSearchResult(data);
        setMessage({ type: 'success', text: '✅ Certificate found successfully!' });
      } else {
        // If data is null, fetchWithAuth already handled the error (e.g., 404, 500)
        // or the server returned no data without a specific error status.
        // The message is set here to indicate a general failure or not found.
        setMessage({ type: 'error', text: '❌ Certificate not found or an error occurred. Please check the registration number.' });
      }
    } catch (error: unknown) { // This catch block will primarily handle network errors not caught by fetchWithAuth
      console.error('Certificate search error (frontend catch):', error);
      if (error instanceof Error) {
        setMessage({ type: 'error', text: `❌ An unexpected error occurred during search: ${error.message || 'Please try again.'}` });
      } else {
        setMessage({ type: 'error', text: '❌ An unknown error occurred during search. Please try again.' });
      }
    } finally {
      setLoading(false); // Clear loading state
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Verify Your Certificate
        </h2>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <input
            type="text"
            placeholder="Enter Registration Number"
            value={searchRegNo}
            onChange={(e) => setSearchRegNo(e.target.value)}
            onKeyDown={handleKeyDown} // Add keydown listener
            className="flex-grow border border-gray-300 px-5 py-3 rounded-lg shadow-sm text-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition duration-200 ease-in-out"
            disabled={loading}
            aria-label="Registration Number"
          />
          <button
            onClick={handleSearch}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg text-lg
                        transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                        ${loading ? 'opacity-70 cursor-not-allowed' : 'shadow-md'}`}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search Certificate'}
          </button>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg text-center font-medium transition-all duration-300 ease-in-out ${
              message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {searchResult && (
          <div className="mt-8 bg-blue-50 p-8 rounded-xl border border-blue-200 shadow-lg animate-fade-in">
            <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center">Certificate Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {/* Row 1 */}
              <div className="detail-item">
                <strong className="text-sm font-medium text-gray-600">Full Name:</strong>
                <p className="text-gray-900 text-lg font-semibold">{searchResult.name}</p>
              </div>
              <div className="detail-item">
                <strong className="text-sm font-medium text-gray-600">Registration No:</strong>
                <p className="text-gray-900 text-lg font-semibold">{searchResult.registrationno}</p>
              </div>

              {/* Row 2 */}
              <div className="detail-item">
                <strong className="text-sm font-medium text-gray-600">Father's Name:</strong>
                <p className="text-gray-800">{searchResult.fathername}</p>
              </div>
              <div className="detail-item">
                <strong className="text-sm font-medium text-gray-600">Mother's Name:</strong>
                <p className="text-gray-800">{searchResult.mothername}</p>
              </div>

              {/* Row 3 */}
              <div className="detail-item">
                <strong className="text-sm font-medium text-gray-600">Course:</strong>
                <p className="text-gray-800">{searchResult.course || 'N/A'}</p>
              </div>
              <div className="detail-item">
                <strong className="text-sm font-medium text-gray-600">Grade:</strong>
                <p className="text-gray-800">{searchResult.grade || 'N/A'}</p>
              </div>

              {/* Row 4 */}
              <div className="detail-item md:col-span-2">
                <strong className="text-sm font-medium text-gray-600">Center Name:</strong>
                <p className="text-gray-800">{searchResult.centername || 'N/A'}</p>
              </div>
              <div className="detail-item md:col-span-2">
                <strong className="text-sm font-medium text-gray-600">Address:</strong>
                <p className="text-gray-800">{searchResult.Address}</p>
              </div>
              
              {/* Optional fields if they exist */}
              {searchResult.issueDate && (
                <div className="detail-item">
                  <strong className="text-sm font-medium text-gray-600">Issue Date:</strong>
                  <p className="text-gray-800">{new Date(searchResult.issueDate).toLocaleDateString()}</p>
                </div>
              )}
              {searchResult.certificateId && (
                <div className="detail-item">
                  <strong className="text-sm font-medium text-gray-600">Certificate ID:</strong>
                  <p className="text-gray-800">{searchResult.certificateId}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tailwind CSS for fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .detail-item {
          background-color: #f0f8ff; /* Light blue background for each item */
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #e0f2fe;
        }
        .detail-item strong {
          color: #3b82f6; /* Blue text for labels */
        }
      `}</style>
    </div>
  );
};

export default CertificateSearch;