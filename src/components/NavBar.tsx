import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DarkModeToggle as ThemeToggle } from './ThemeToggle';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="relative bg-background shadow z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              Elite<span className="text-accent">Cars</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="#features" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              How It Works
            </a>
            <a href="#destinations" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Popular Routes
            </a>
            <a href="#testimonials" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Testimonials
            </a>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link to="/signin">
                <button className="ml-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium">
                  Sign In
                </button>
              </Link>
              <Link to="/register">
                <button className="ml-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium">
                  Register
                </button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary hover:bg-secondary focus:outline-none"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background shadow-lg rounded-b-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#features"
              className="block px-3 py-2 rounded-md text-foreground hover:text-primary hover:bg-secondary"
              onClick={toggleMenu}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block px-3 py-2 rounded-md text-foreground hover:text-primary hover:bg-secondary"
              onClick={toggleMenu}
            >
              How It Works
            </a>
            <a
              href="#destinations"
              className="block px-3 py-2 rounded-md text-foreground hover:text-primary hover:bg-secondary"
              onClick={toggleMenu}
            >
              Popular Routes
            </a>
            <a
              href="#testimonials"
              className="block px-3 py-2 rounded-md text-foreground hover:text-primary hover:bg-secondary"
              onClick={toggleMenu}
            >
              Testimonials
            </a>
            <div className="pt-4 pb-3 border-t border-border">
              <Link to="/signin" onClick={toggleMenu}>
                <button className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium">
                  Sign In
                </button>
              </Link>
              <Link to="/register" onClick={toggleMenu}>
                <button className="w-full px-4 py-2 bg-primary text-white rounded-md text-sm font-medium">
                  Register
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;



