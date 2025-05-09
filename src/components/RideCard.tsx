
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { format } from 'date-fns';
import { MapPin, Clock, Users, Star, Shield, Settings } from 'lucide-react';

// Import the Ride type from rides.ts instead of lib/types
import { Ride as RideData } from '@/data/rides';

// Create a new interface that extends RideData with the additional properties needed
interface RideCardProps {
  ride: RideData;
  userRole?: string;
  onAction: (action: 'book' | 'offer' | 'details' | 'manage') => void;
  isLoading?: boolean;
}

const RideCard: React.FC<RideCardProps> = ({ ride, userRole = 'passenger', onAction, isLoading = false }) => {
  const handleAction = () => {
    if (userRole === 'passenger') {
      onAction('book');
    } else if (userRole === 'driver') {
      onAction('offer');
    } else {
      onAction('details');
    }
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center">
              <MapPin className="h-4 w-4 mr-1" /> 
              {ride.from} to {ride.to}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Clock className="h-4 w-4 mr-1" />
              {ride.date}, {ride.departureTime} - {ride.arrivalTime}
            </CardDescription>
          </div>
          {ride.verified && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Shield className="h-3 w-3 mr-1" /> Verified
            </Badge>
          )}
          {ride.status && (
            <Badge 
              className={`
                ${ride.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                ${ride.status === 'completed' ? 'bg-blue-100 text-blue-800' : ''}
                ${ride.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
              `}
            >
              {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-2">
              <AvatarFallback>{ride.driverName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{ride.driverName}</p>
              <p className="text-xs text-muted-foreground flex items-center">
                <Star className="h-3 w-3 mr-1 text-yellow-500" />
                {ride.driverRating} ({ride.rating} ratings)
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">₹{ride.price}</p>
            <p className="text-xs text-muted-foreground flex items-center justify-end">
              <Users className="h-3 w-3 mr-1" />
              {ride.seatsAvailable} seats available
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleAction} 
          className="w-full" 
          disabled={isLoading || ride.seatsAvailable < 1}
        >
          {userRole === 'passenger' ? 'Book Ride' : 'Manage Ride'}
        </Button>
        {userRole === 'driver' && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => onAction('manage')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Manage Ride
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default RideCard;








