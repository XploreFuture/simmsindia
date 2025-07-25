import { Link } from "react-router-dom";
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'; // Import icons

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white sticky ">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h3 className="text-lg font-bold mb-3">About Simms India</h3>
          <p className="text-sm">
            Simms India is dedicated to providing high-quality education and training in various fields.
            We aim to empower individuals with the knowledge and skills needed to succeed in their careers.
          </p>
          <div className="flex space-x-4 mt-4">
            <a
              href="https://www.instagram.com/simms_education?igsh=aXpnaTR6MHk3dXE2" // Replace with your Instagram URL
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-300"
              aria-label="Instagram"
            >
              <FaInstagram className="h-6 w-6" />
            </a>
            <a
              href="https://whatsapp.com/channel/0029VaLMrM2EawdjAQBuT73G" // Replace with your WhatsApp number, e.g., https://wa.me/91XXXXXXXXXX
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-300"
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/courses" className="hover:underline">Courses</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            <li><Link to="/register" className="hover:underline">Register</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-bold mb-3">Contact</h3>
          <p className="text-sm">📍 Regional Office - Balasore, Odisha, India</p>
          <p className="text-sm">✉️ simmsofficial98@gmail.com</p>
          <p className="text-sm">📍 Corporate Office - Kolkata, West Bengal, India</p>
          <p className="text-sm">✉️ simms.corf.off@gmail.com</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} Simms India. All rights reserved.
        <p className="mt-1">
          Developed and maintained by{' '}
          <a
            href="https://ommkardwibedi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Ommkar Dwibedi
          </a>
        </p>
      </div>
    </footer>
  );
}