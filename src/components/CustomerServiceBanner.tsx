
import React from 'react';
import { MessageSquare, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CustomerServiceBanner = () => {
  return (
    <div className="bg-gradient-to-r from-primary/90 to-primary text-white rounded-xl overflow-hidden shadow-xl border border-white/10 hover-scale">
      <div className="flex flex-col md:flex-row items-center p-6 relative">
        {/* Background image overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-10" 
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=1000&auto=format')", 
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        
        {/* Decorative circles in background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
        
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-8 relative z-10">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center shadow-inner animate-pulse">
            <MessageSquare size={38} className="text-white" />
          </div>
        </div>
        
        <div className="flex-grow text-center md:text-left relative z-10">
          <h3 className="text-2xl font-bold mb-1 animate-fade-in">24/7 Customer Support</h3>
          <p className="text-white/90 max-w-xl animate-fade-in animate-delay-100">
            Our dedicated team is always here to help you. Contact us anytime for assistance with your rides or bookings.
          </p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start mt-4 gap-3 animate-fade-in animate-delay-200">
            <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm hover:bg-white/20 transition-colors">
              <Phone size={16} className="mr-2 text-accent" />
              <span className="text-sm font-medium">+91 98765 43210</span>
            </div>
            <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm hover:bg-white/20 transition-colors">
              <Clock size={16} className="mr-2 text-accent" />
              <span className="text-sm font-medium">Available 24/7</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 md:mt-0 md:ml-6 flex-shrink-0 relative z-10 animate-fade-in animate-delay-300">
          <Button 
            variant="secondary" 
            size="lg" 
            className="font-semibold px-6 bg-accent text-secondary border-accent hover:bg-accent/90 shadow-md btn-shine"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerServiceBanner;

