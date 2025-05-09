
import React from 'react';
import { ArrowRight, MapPin, Users } from 'lucide-react';

interface DestinationCardProps {
  from: string;
  to: string;
  price: string;
  imageUrl: string;
  rideCount: number;
  onViewDetails?: () => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  from,
  to,
  price,
  imageUrl,
  rideCount,
  onViewDetails
}) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 card-hover">
      <div 
        className="h-60 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-4">
          <div className="absolute top-4 right-4 bg-accent text-slate-900 font-bold px-3 py-1.5 rounded-full text-sm shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer">
            ₹{price}
          </div>
          <div className="flex items-center justify-between animate-fade-in">
            <div className="flex items-center space-x-2 text-white">
              <div className="flex flex-col">
                <div className="flex items-center mb-1">
                  <MapPin size={16} className="text-accent mr-1" />
                  <span className="font-semibold text-lg text-shadow">{from}</span>
                </div>
                <ArrowRight size={18} className="text-accent mb-1 ml-2" />
                <div className="flex items-center">
                  <MapPin size={16} className="text-accent mr-1" />
                  <span className="font-semibold text-lg text-shadow">{to}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm flex items-center">
            <Users className="mr-2 h-4 w-4 text-primary" />
            <span>{rideCount}+ rides available</span>
          </span>
          <button 
            className="text-primary hover:text-primary/80 text-sm font-medium bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors btn-shine"
            onClick={onViewDetails}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
