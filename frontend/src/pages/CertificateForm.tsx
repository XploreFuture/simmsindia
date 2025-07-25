import React, { useState } from 'react';
import { fetchWithAuth } from '../utils/api'; // Import your fetchWithAuth utility
import type { certificate } from '../types/api'; // Import the Certificate interface from your types

// Use the Certificate interface directly from types/api.ts for consistency
type CertificateFormData = Omit<certificate, '_id' | 'createdAt' | 'updatedAt'>;

const CertificateAddForm: React.FC = () => {
  const [formData, setFormData] = useState<CertificateFormData>({
    name: '',
    fathername: '',
    mothername: '',
    course: '',
    registrationno: '',
    Address: '',
    centername: '',
    grade: '',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    setIsSuccess(false);
    setLoading(true);

    try {
      // Use fetchWithAuth for consistency with your authentication system
      const response = await fetchWithAuth<certificate>('/api/certificates/add', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response) {
        setMessage('✅ Certificate added successfully!');
        setIsSuccess(true);
        // Optionally clear form after successful submission
        setFormData({
          name: '',
          fathername: '',
          mothername: '',
          course: '',
          registrationno: '',
          Address: '',
          centername: '',
          grade: '',
        });
      } else {
        // fetchWithAuth already handles error messages and redirects,
        // so a null response means an error occurred and was handled.
        setMessage('❌ Failed to add certificate. Please check console for details.');
        setIsSuccess(false);
      }
    } catch (error) {
      // This catch block will only run for network errors or if fetchWithAuth re-throws
      console.error('Error adding certificate:', error);
      setMessage(`❌ An unexpected error occurred: 'Please try again.'}`);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-xl my-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add Certificate</h2>
      
      {message && (
        <div className={`p-3 mb-4 rounded-md text-center ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key}>
            <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {key.replace(/([A-Z])/g, ' $1')} {/* Makes "registrationno" -> "Registration No" */}
            </label>
            <input
              type="text"
              id={key}
              name={key}
              value={value}
              onChange={handleChange}
              // Mark 'name' and 'registrationno' as required based on your schema
              required={key === 'name' || key === 'registrationno' || key === 'fathername' || key === 'mothername' || key === 'Address'}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              disabled={loading}
            />
          </div>
        ))}
        <button 
          type="submit" 
          className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-colors duration-200 ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={loading}
        >
          {loading ? 'Adding Certificate...' : 'Submit Certificate'}
        </button>
      </form>
    </div>
  );
};

export default CertificateAddForm;