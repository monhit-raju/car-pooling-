
import React from 'react';
import { Search, Calendar, Users, MapPin } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: 'Search for a Ride',
      description: 'Enter your desired destination and find available rides that match your schedule.',
      icon: Search,
      color: 'text-primary'
    },
    {
      id: 2,
      title: 'Book Your Seat',
      description: 'Select your preferred ride option and secure your seat with instant booking.',
      icon: Calendar,
      color: 'text-accent'
    },
    {
      id: 3,
      title: 'Meet at the Pickup Point',
      description: 'Get directions to your pickup location and meet your driver and co-passengers.',
      icon: MapPin,
      color: 'text-secondary'
    },
    {
      id: 4,
      title: 'Enjoy Your Journey',
      description: 'Travel comfortably to your destination with our verified community of drivers.',
      icon: Users,
      color: 'text-primary'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">How Elite Cars Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our streamlined process makes carpooling easy, safe, and convenient for everyone.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            
            return (
              <div key={step.id} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className={`rounded-full w-16 h-16 flex items-center justify-center mb-5 bg-white shadow-md ${step.color}`}>
                    <Icon size={28} />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-slate-800">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                
                {/* Connector line */}
                {step.id !== steps.length && (
                  <div className="hidden lg:block absolute top-1/4 left-full w-full h-0.5 bg-gray-200 -z-10 transform -translate-y-1/2">
                    <div className="absolute right-0 -top-1.5 h-4 w-4 rounded-full bg-primary"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
