import React from 'react';
import { Link } from 'react-router-dom';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8 md:p-12 border border-gray-200">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 text-center">
          Contact Us
        </h1>
        <p className="text-center text-gray-700 text-lg mb-10 max-w-2xl mx-auto">
          We'd love to hear from you! Whether you have questions about our courses, admissions, or just want to say hello, feel free to reach out.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Regional Office */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200 text-center">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Regional Office</h2>
            <p className="text-gray-700 mb-2">
              <span className="font-bold">📍 Address:</span> Balasore, Odisha, India
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-bold">✉️ Email:</span>{' '}
              <a href="mailto:simmsofficial98@gmail.com" className="text-blue-600 hover:underline">
                simmsofficial98@gmail.com
              </a>
            </p>
            {/* Add phone number if available */}
            {/* <p className="text-gray-700">
              <span className="font-bold">📞 Phone:</span> +91 12345 67890
            </p> */}
          </div>

          {/* Corporate Office */}
          <div className="bg-green-50 p-6 rounded-lg shadow-md border border-green-200 text-center">
            <h2 className="text-2xl font-semibold text-green-800 mb-4">Corporate Office</h2>
            <p className="text-gray-700 mb-2">
              <span className="font-bold">📍 Address:</span> Kolkata, West Bengal, India
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-bold">✉️ Email:</span>{' '}
              <a href="mailto:simms.corf.off@gmail.com" className="text-blue-600 hover:underline">
                simms.corf.off@gmail.com
              </a>
            </p>
            {/* Add phone number if available */}
            {/* <p className="text-gray-700">
              <span className="font-bold">📞 Phone:</span> +91 98765 43210
            </p> */}
          </div>
        </div>

        {/* Optional: Simple Call to Action */}
        <div className="text-center mt-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Have a specific query?</h2>
          <p className="text-gray-700 text-lg mb-6">
            For admissions, please visit our <Link to="/studentadmission" className="text-blue-600 hover:underline font-semibold">Student Admission page</Link>.
            For general inquiries, you can also connect with us on social media.
          </p>
          {/* Add social media links/icons here if applicable */}
          <div className="flex justify-center space-x-4">
            {/* Example Social Media Icons (replace with actual icons/links) */}
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {/* Facebook Icon */}
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {/* Twitter/X Icon */}
                <path d="M19.615 3.184c.474.172.778.658.778 1.157 0 .5-.304.985-.778 1.157L17.26 6.883 15.01 4.633a.75.75 0 00-1.06 1.06l2.25 2.25-2.25 2.25a.75.75 0 001.06 1.06l2.25-2.25 2.25 2.25a.75.75 0 001.06-1.06l-2.25-2.25 2.25-2.25a.75.75 0 00-1.06-1.06l-2.25 2.25-2.25-2.25a.75.75 0 00-1.06 1.06l2.25 2.25-2.25 2.25a.75.75 0 001.06 1.06l2.25-2.25 2.25 2.25a.75.75 0 001.06-1.06l-2.25-2.25 2.25-2.25a.75.75 0 00-1.06-1.06z" />
              </svg>
            </a>
            {/* Add more social media icons as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;