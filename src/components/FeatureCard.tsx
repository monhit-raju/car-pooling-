
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon: Icon,
  color = 'primary' 
}) => {
  const colorClasses = {
    primary: 'bg-primary text-white',
    accent: 'bg-accent text-secondary',
    secondary: 'bg-secondary text-white',
    white: 'bg-white text-primary border border-gray-200'
  };
  
  const iconBgClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.primary;
  
  return (
    <div className="feature-card bg-white rounded-xl shadow-md p-6 transition-all duration-300">
      <div className={`rounded-full w-14 h-14 flex items-center justify-center mb-5 ${iconBgClass}`}>
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-slate-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
