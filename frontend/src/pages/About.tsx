import React from 'react';
import {Link} from "react-router-dom"

// Image for the "About Our Institution" section (reusing from Home.tsx)
const ABOUT_US_IMAGE = "./slide/image2.png"; // Replace with your actual image path

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg p-8 md:p-12 border border-gray-200">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 text-center">
          About SIMMS INDIA
        </h1>

        <div className="flex flex-col md:flex-row items-center md:space-x-8 mb-10">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <img
              src={ABOUT_US_IMAGE}
              alt="About SIMMS INDIA"
              className="w-full h-200 object-cover rounded-lg shadow-md"
              onError={(e) => { e.currentTarget.src = "https://placehold.co/600x300/cccccc/000000?text=Image+Error"; }}
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-blue-700 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-4">
              At SIMMS INDIA, our mission is to empower individuals with the knowledge, skills, and values necessary to thrive in a rapidly evolving global landscape. We are dedicated to providing accessible, high-quality education that fosters innovation, critical thinking, and personal growth.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              We strive to create a supportive and inclusive learning environment where every student can unlock their full potential and contribute meaningfully to society.
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Vision</h2>
        <p className="text-gray-700 leading-relaxed text-lg mb-8 text-center max-w-3xl mx-auto">
          To be a leading institution recognized for excellence in vocational training and skill development, shaping a generation of competent professionals and responsible citizens who drive positive change in their communities and beyond.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200">
            <h3 className="text-2xl font-semibold text-blue-800 mb-3">What We Offer</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Industry-relevant certified programs</li>
              <li>Experienced and dedicated faculty</li>
              <li>State-of-the-art infrastructure and learning facilities</li>
              <li>Strong industry partnerships for placements and internships</li>
              <li>Holistic development focusing on both skills and values</li>
            </ul>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow-md border border-green-200">
            <h3 className="text-2xl font-semibold text-green-800 mb-3">Our Values</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Excellence: Striving for the highest standards in education.</li>
              <li>Integrity: Upholding honesty and ethical conduct.</li>
              <li>Innovation: Embracing new ideas and technologies.</li>
              <li>Inclusivity: Fostering a diverse and welcoming community.</li>
              <li>Empowerment: Equipping students for lifelong success.</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 text-lg">
            Join us on a journey of learning and transformation.
          </p>
          <Link
            to="/register"
            className="mt-6 inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-transform duration-200 hover:scale-105"
          >
            Register Today!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;