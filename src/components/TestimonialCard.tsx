
import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  role: string;
  comment: string;
  rating: number;
  avatarUrl: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  comment,
  rating,
  avatarUrl
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center space-x-4 mb-4">
        <div className="rounded-full w-14 h-14 overflow-hidden">
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-800">{name}</h4>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>
      
      <div className="flex mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i}
            size={18}
            className={i < rating ? "text-accent fill-accent" : "text-gray-300"}
          />
        ))}
      </div>
      
      <p className="text-gray-600 italic">"{comment}"</p>
    </div>
  );
};

export default TestimonialCard;
