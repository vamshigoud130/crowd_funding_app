import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Mail, MapPin, Phone } from 'lucide-react';

const SocialIcon = ({ type }) => {
  const paths = {
    facebook: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
    twitter: "M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753C20.18 7.773 21.692 5.25 22 4.009z",
    instagram: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M6 2h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z",
    linkedin: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z"
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[type]} />
    </svg>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 pt-16 pb-8 border-t border-gray-800 text-gray-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Brand & About */}
          <div className="space-y-6">
            <NavLink to="/" className="flex items-center gap-2">
              <div className="bg-emerald-500 text-white p-2 rounded-xl">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <span className="text-2xl font-bold text-white">ImpactFund</span>
            </NavLink>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering individuals and NGOs to raise funds for medical emergencies, social causes, and creative ideas. Together, we can make a difference.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors">
                <SocialIcon type="facebook" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors">
                <SocialIcon type="twitter" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors">
                <SocialIcon type="instagram" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors">
                <SocialIcon type="linkedin" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><NavLink to="/about" className="hover:text-emerald-400 transition-colors">About Us</NavLink></li>
              <li><NavLink to="/campaigns" className="hover:text-emerald-400 transition-colors">Browse Campaigns</NavLink></li>
              <li><NavLink to="/how-it-works" className="hover:text-emerald-400 transition-colors">How it Works</NavLink></li>
              <li><NavLink to="/success-stories" className="hover:text-emerald-400 transition-colors">Success Stories</NavLink></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-gray-400">Jodimetla,Hyderabad, 500088</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-gray-400">+91 7981389738</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-gray-400">chenagonivamshi@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ImpactFund Inc. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Trust & Safety</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;