import React, { useState } from 'react';
import { fetchWithAuth } from '../utils/api'; // Import your fetchWithAuth utility
import type { Student } from '../types/api'; // Import the Student interface from your types

// Define the form data type based on the Student interface.
// Omit fields that are generated/populated by the backend (like _id, uid, email, timestamps)
type StudentFormData = Omit<Student, '_id' | 'uid' | 'email' | 'createdAt' | 'updatedAt' | 'role'>;

const StudentForm: React.FC = () => {
  const [formData, setFormData] = useState<StudentFormData>({
    fullName: '',
    whatsapp: '',
    dob: '',
    Address: '',
    Course: '',
    Fname: '',
    Mname: '',
    religion: '', // Default to empty string or a specific default religion
    session: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Options for the religion dropdown, mirroring your Student model's enum
  const religionOptions = [
    '', // Empty option for initial selection
    'Hinduism',
    'Islam',
    'Christianity',
    'Sikhism',
    'Buddhism',
    'Jainism',
    'Other',
    'Prefer not to say',
  ];

  // Map for custom labels
  const labelMap: Record<keyof StudentFormData, string> = {
    fullName: 'Full Name',
    whatsapp: 'WhatsApp Number',
    dob: 'Date of Birth',
    Address: 'Full Address',
    Course: 'Course Name',
    Fname: "Father's Name", // Custom label
    Mname: "Mother's Name", // Custom label
    religion: 'Religion',
    session: 'Academic Session',
  };

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
      // fetchWithAuth automatically includes credentials (JWT token)
      const response = await fetchWithAuth<Student>('/api/students/add', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response) {
        setMessage({ type: 'success', text: '✅ Student admission submitted successfully!' });
        setIsSuccess(true);
        // Clear form after successful submission
        setFormData({
          fullName: '',
          whatsapp: '',
          dob: '',
          Address: '',
          Course: '',
          Fname: '',
          Mname: '',
          religion: '',
          session: '',
        });
      } else {
        // fetchWithAuth returns null on error, and handles messages/redirects internally.
        // This means an error occurred and was already handled (e.g., by redirecting to login).
        setMessage({ type: 'error', text: '❌ Submission failed. Please check console for details or log in again.' });
        setIsSuccess(false);
      }
    } catch (error) { // Keep 'any' or define a more specific error type if needed
      // This catch block will primarily run for network errors or if fetchWithAuth re-throws a specific error
      console.error('Student submission error:', error);
      setMessage({ type: 'error', text: `❌ An unexpected error occurred:s 'Please try again.'}` }); 
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Define which fields are required based on your Student schema
  const requiredFields = ['fullName', 'whatsapp', 'dob', 'Address', 'Course', 'Fname', 'Mname', 'session'];

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Student Admission Form
      </h2>

      {message && (
        <div className={`p-3 mb-4 rounded-md text-center ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {(Object.keys(formData) as Array<keyof StudentFormData>).map((key) => (
          <div key={key} className="mb-2">
            <label htmlFor={key} className="block mb-1 text-sm font-medium text-gray-700 capitalize">
              {labelMap[key] || key.replace(/([A-Z])/g, ' $1').trim()} {/* Use labelMap or fallback */}
            </label>

            {key === 'religion' ? (
              <select
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                required={requiredFields.includes(key)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                {religionOptions.map(option => (
                  <option key={option} value={option}>
                    {option === '' ? 'Select Religion' : option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={key === 'dob' ? 'date' : 'text'}
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
            {loading ? 'Submitting...' : 'Submit Admission'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;