import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        {/* Left Links */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm">
          <Link to="/about" className="hover:text-yellow-600 transition">About Us</Link>
          <Link to="/privacy-policy" className="hover:text-yellow-600 transition">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-yellow-600 transition">Terms of Service</Link>
          <Link to="/contact" className="hover:text-yellow-600 transition">Contact Us</Link>
        </div>

        <div className="flex gap-4 mt-4 md:mt-0 text-gray-600">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1877F2] hover:text-yellow-600 transition"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1DA1F2] hover:text-yellow-600 transition"
          >
            <FaTwitter />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0A66C2] hover:text-yellow-600 transition"
          >
            <FaLinkedinIn />
          </a>
        </div>
              </div>
        
              {/* Copyright */}
              <div className="text-center text-md text-gray-500 mt-4 font-bold">
          &copy; {new Date().getFullYear()} <span className="text-black">inn</span>
          <span className="text-red-600">ogenX</span> All rights reserved.
        </div>
    </footer>
  );
};

export default Footer;
