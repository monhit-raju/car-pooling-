
import React from 'react';
import { Facebook, Twitter, Instagram, Smartphone, Mail, MapPin, Users } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              Elite<span className="text-accent">Cars</span>
            </h3>
            <p className="text-gray-400 mb-4">
              Premium carpooling service connecting drivers and passengers for comfortable, 
              safe and affordable rides across the country.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-accent transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent transition-colors">How It Works</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent transition-colors">Popular Routes</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent transition-colors">Become a Driver</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent transition-colors">Safety Guidelines</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-accent transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent transition-colors">Privacy Policy</a></li>
              <li>
                <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                  <span className="flex items-center space-x-2">
                    <Smartphone size={16} />
                    <span>24/7 Customer Service</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-accent flex-shrink-0 mt-1" />
                <span className="text-gray-400">123 Carpooling Street, Transport City, TC 10010</span>
              </li>
              <li className="flex items-center space-x-3">
                <Smartphone size={18} className="text-accent flex-shrink-0" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-accent flex-shrink-0" />
                <span className="text-gray-400">support@elitecars.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Founders Section */}
        <div className="pt-8 border-t border-gray-800 mb-8">
          <div className="text-center mb-4">
            <h4 className="text-lg font-bold mb-2 flex items-center justify-center">
              <Users size={18} className="mr-2 text-accent" />
              Our Founders
            </h4>
            <p className="text-gray-400">
              Elite Cars was created by a team of visionary entrepreneurs:
              <span className="text-accent font-medium"> L. MONHIT RAJU, KAVINDRA, HARIHARAN.V.S</span> and 
              <span className="text-accent font-medium"> DEEPAK.P</span>
            </p>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Elite Cars. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
