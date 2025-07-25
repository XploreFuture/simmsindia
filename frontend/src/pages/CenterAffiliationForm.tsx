import React, { useState } from 'react';
import { fetchWithAuth } from '../utils/api'; // Import your fetchWithAuth utility
import type { Centeraffilation } from '../types/api'; // Import the Centeraffilation interface from your types

// Define the form data type based on the Centeraffilation interface.
// Omit fields that are generated/populated by the backend (_id, timestamps)
type CenterFormData = Omit<Centeraffilation, '_id' | 'createdAt' | 'updatedAt'>;

const CenterAffiliationForm: React.FC = () => {
  const [formData, setFormData] = useState<CenterFormData>({
    name: '',
    address: '',
    centercode: '',
    qualification: '',
    seatingcapacity: '',
    strength: '',
    noofsystem: '',
    noofclassroom: '',
    office: 'no',
    receptiondesk: 'no',
    toilet: 'no',
    library: 'no',
    website: '',
    Contactno: '',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Define required fields based on your Centeraffilation schema
  const requiredFields = ['name', 'address', 'centercode', 'seatingcapacity', 'strength', 'Contactno'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    setIsSuccess(false);
    setLoading(true);

    try {
      // Use fetchWithAuth for consistency with your authentication system
      // It handles JWT tokens and refresh logic automatically
      const response = await fetchWithAuth<Centeraffilation>('/api/center/add', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response) {
        setMessage('✅ Center affiliation submitted successfully!');
        setIsSuccess(true);
        // Optionally clear form after successful submission
        setFormData({
          name: '',
          address: '',
          centercode: '',
          qualification: '',
          seatingcapacity: '',
          strength: '',
          noofsystem: '',
          noofclassroom: '',
          office: 'no',
          receptiondesk: 'no',
          toilet: 'no',
          library: 'no',
          website: '',
          Contactno: '',
        });
      } else {
        // fetchWithAuth returns null on error, and handles messages/redirects internally.
        // This means an error occurred and was already handled (e.g., by redirecting to login).
        setMessage('❌ Submission failed. Please check console for details or log in again.');
        setIsSuccess(false);
      }
    } catch (error) {
      // This catch block will primarily run for network errors or if fetchWithAuth re-throws a specific error
      console.error('Center affiliation submission error:', error);
      setMessage(`❌ An unexpected error occurred: 'Please try again.'}`);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Center Affiliation Form
      </h2>

      {message && (
        <div className={`p-3 mb-4 rounded-md text-center ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {(Object.keys(formData) as Array<keyof CenterFormData>).map((key) => (
          <div key={key} className="mb-2">
            <label htmlFor={key} className="block mb-1 text-sm font-medium text-gray-700 capitalize">
              {key.replace(/([A-Z])/g, ' $1')} {/* Converts "centercode" to "Center Code" */}
            </label>
            {['office', 'receptiondesk', 'toilet'].includes(key) ? (
              <select
                id={key}
                name={key}
                value={formData[key as 'office' | 'receptiondesk' | 'toilet']} // Cast to specific enum type
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            ) : key === 'library' ? (
              <select
                id={key}
                name={key}
                value={formData[key as 'library']} // Cast to specific enum type
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            ) : (
              <input
                type="text"
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                required={requiredFields.includes(key)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            )}
          </div>
        ))}

        <div className="md:col-span-2">
          <button
            type="submit"
            className={`w-full mt-4 py-3 px-4 rounded-md text-white font-semibold transition-colors duration-200 ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Affiliation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CenterAffiliationForm;