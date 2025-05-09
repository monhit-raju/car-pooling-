
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchForm = () => {
  const [formState, setFormState] = useState({
    from: '',
    to: '',
    date: '',
    passengers: '1',
    time: ''
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store search parameters in localStorage for later use
    localStorage.setItem('elitecars_search', JSON.stringify(formState));
    // Redirect to sign in page
    navigate('/signin');
  };

  return (
    <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-5xl mx-auto relative z-10 border border-gray-100 animate-fade-in animate-delay-200">
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden rounded-xl z-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1581593762136-4c266e9dab56?q=80&w=1000&auto=format')", 
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>
      
      <div className="relative z-1">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 flex items-center">
          <span className="bg-primary/10 text-primary p-2 rounded-full mr-3">
            <MapPin size={18} />
          </span>
          Find Your Perfect Ride
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                name="from"
                value={formState.from}
                onChange={handleChange}
                placeholder="Enter city or location"
                className="w-full pl-10 h-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary transition-colors"
                required
              />
            </div>
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                name="to"
                value={formState.to}
                onChange={handleChange}
                placeholder="Enter destination"
                className="w-full pl-10 h-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary transition-colors"
                required
              />
            </div>
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="date"
                name="date"
                value={formState.date}
                onChange={handleChange}
                className="w-full pl-10 h-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary transition-colors"
                required
              />
            </div>
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="time"
                name="time"
                value={formState.time}
                onChange={handleChange}
                className="w-full pl-10 h-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary transition-colors"
              />
            </div>
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
            <div className="relative">
              <Users className="absolute left-3 top-3 text-gray-400" size={18} />
              <select
                name="passengers"
                value={formState.passengers}
                onChange={handleChange}
                className="w-full pl-10 h-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none hover:border-primary transition-colors"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'passenger' : 'passengers'}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-3 lg:col-span-5 mt-4">
            <Button 
              type="submit" 
              className="w-full md:w-auto px-10 h-12 float-right bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary btn-shine shadow-md"
            >
              Search Rides
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchForm;
