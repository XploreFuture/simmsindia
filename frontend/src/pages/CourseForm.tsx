import React, { useState } from "react";
import { fetchWithAuth } from "../utils/api"; // Import your fetchWithAuth utility
import type { Course } from "../types/api"; // Import the Course interface from your types

// Define the form data type based on the Course interface, omitting _id, createdAt, updatedAt
type CourseFormData = Omit<Course, "_id" | "createdAt" | "updatedAt">;

export default function CourseForm() {
  const [formData, setFormData] = useState<CourseFormData>({
    name: "",
    serialno: "",
    duration: "",
    eligibility: "",
    coursefee: "",
    schilarship: "", // Keep the typo 'schilarship' as per your schema
    details: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    setIsSuccess(false);
    setLoading(true);

    try {
      // Use fetchWithAuth for consistency with your authentication system
      const response = await fetchWithAuth<Course>("/api/courses/add", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response) {
        setMessage("✅ Course added successfully!");
        setIsSuccess(true);
        // Clear form after successful submission
        setFormData({
          name: "",
          serialno: "",
          duration: "",
          eligibility: "",
          coursefee: "",
          schilarship: "",
          details: "",
        });
      } else {
        // fetchWithAuth already handles error messages and redirects,
        // so a null response means an error occurred and was handled.
        setMessage("❌ Failed to add course. Please check console for details.");
        setIsSuccess(false);
      }
    } catch (error) {
      // This catch block will only run for network errors or if fetchWithAuth re-throws
      console.error("Course submission error:", error);
      setMessage(`❌ An unexpected error occurred:"Please try again."}`);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-xl my-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add New Course</h2>
      
      {message && (
        <div className={`p-3 mb-4 rounded-md text-center ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {key.replace(/([A-Z])/g, ' $1')} {/* Makes "serialno" -> "Serialno" */}
            </label>
            {key === "details" ? (
              <textarea
                id={key}
                name={key}
                value={formData[key as keyof CourseFormData]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm min-h-[80px]"
                disabled={loading}
              />
            ) : (
              <input
                type="text"
                id={key}
                name={key}
                value={formData[key as keyof CourseFormData]}
                onChange={handleChange}
                // Mark required fields based on your schema
                required={["name", "serialno", "duration", "coursefee", "schilarship"].includes(key)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                disabled={loading}
              />
            )}
          </div>
        ))}
        <button 
          type="submit" 
          className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-colors duration-200 ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={loading}
        >
          {loading ? 'Adding Course...' : 'Submit Course'}
        </button>
      </form>
    </div>
  );
}