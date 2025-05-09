
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative h-[600px] bg-slate-900 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=2000&auto=format')", 
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.6)"
        }}
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 hero-gradient z-1"></div>
      
      {/* Hero Content */}
      <div className="relative z-2 flex flex-col items-center justify-center h-full container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
          Premium Carpooling <span className="text-accent">Experience</span>
        </h1>
        <p className="text-xl text-gray-200 mb-8 max-w-2xl animate-fade-in animate-delay-100">
          Join the elite community of drivers and passengers for comfortable, safe and affordable rides.
        </p>
        
        {/* Quick Search */}
        <div className="w-full max-w-4xl bg-white p-4 rounded-lg shadow-lg animate-fade-in animate-delay-200">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="From" 
                className="w-full pl-10 h-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="relative flex-grow">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="To" 
                className="w-full pl-10 h-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button className="h-12 px-8">
              <Search className="mr-2" size={16} />
              Find Rides
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-12 animate-fade-in animate-delay-300">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">15K+</p>
            <p className="text-sm text-gray-300">Active Drivers</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">100K+</p>
            <p className="text-sm text-gray-300">Happy Riders</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">500+</p>
            <p className="text-sm text-gray-300">Cities Covered</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

