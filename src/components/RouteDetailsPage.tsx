
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Calendar, Clock, Users, Car, 
  IndianRupee, Star, Info, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { rides } from '@/data/rides';

interface RouteDetailsPageProps {
  from: string;
  to: string;
  price: string;
  imageUrl: string;
  rideCount: number;
  onClose: () => void;
}

const RouteDetailsPage: React.FC<RouteDetailsPageProps> = ({
  from,
  to,
  price,
  imageUrl,
  rideCount,
  onClose
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'reviews'>('overview');
  
  // Filter rides that match this route
  const routeRides = rides.filter(
    ride => ride.from.toLowerCase().includes(from.toLowerCase()) && 
           ride.to.toLowerCase().includes(to.toLowerCase())
  );
  
  const handleBookRide = () => {
    // Check if user is logged in
    const userStr = localStorage.getItem('elitecars_current_user');
    if (!userStr) {
      toast({
        title: "Authentication required",
        description: "Please sign in to book a ride",
        variant: "destructive"
      });
      navigate('/signin');
      return;
    }
    
    // Store search parameters in localStorage for ride search
    localStorage.setItem('elitecars_search', JSON.stringify({ from, to }));
    navigate('/dashboard');
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero section with image */}
      <div 
        className="h-64 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30">
          <div className="container mx-auto px-4 h-full flex flex-col justify-between pt-4 pb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-10 h-10 rounded-full bg-white/20 text-white self-start"
              onClick={onClose}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-accent" />
                <h1 className="text-2xl font-bold">{from} to {to}</h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  <span className="font-bold text-lg">{price}</span>
                </span>
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{rideCount}+ rides available</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex">
            <button 
              className={`px-4 py-3 font-medium text-sm border-b-2 ${
                activeTab === 'overview' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`px-4 py-3 font-medium text-sm border-b-2 ${
                activeTab === 'schedule' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('schedule')}
            >
              Ride Schedule
            </button>
            <button 
              className={`px-4 py-3 font-medium text-sm border-b-2 ${
                activeTab === 'reviews' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Route Overview</h2>
              <p className="text-gray-600">
                Travel comfortably from {from} to {to} with our trusted drivers. This popular route has {rideCount} rides 
                available on a daily basis with prices starting from ₹{price}.
              </p>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Average Duration</h3>
                      <p className="text-gray-600">3-4 hours</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Passenger Options</h3>
                      <p className="text-gray-600">1-6 seats</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Car className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Vehicle Types</h3>
                      <p className="text-gray-600">Sedan, SUV, Hatchback</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4">Popular Landmarks</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-3 mt-1">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{from} Pickup Points</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Railway Station, Bus Stand, City Center, Airport
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center my-2">
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex items-start">
                    <div className="bg-accent/10 p-2 rounded-full mr-3 mt-1">
                      <MapPin className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium">{to} Drop Points</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        City Center, Tourist Spots, Railway Station, Bus Stand
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-8">
              <Button 
                onClick={handleBookRide}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full"
              >
                Find Available Rides
              </Button>
            </div>
          </div>
        )}
        
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Available Rides</h2>
            
            {routeRides.length > 0 ? (
              <div className="space-y-4">
                {routeRides.map(ride => (
                  <Card key={ride.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start flex-wrap gap-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <Badge variant="outline" className="font-medium bg-primary/10 mr-2">
                              <Calendar className="mr-1 h-3 w-3" />
                              {ride.date}
                            </Badge>
                            <Badge variant="outline" className="font-medium bg-primary/10">
                              <Clock className="mr-1 h-3 w-3" />
                              {ride.departureTime}
                            </Badge>
                          </div>
                          
                          <h3 className="font-semibold">{ride.from} → {ride.to}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {ride.fromDetail} → {ride.toDetail}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center justify-end mb-2">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-gray-700">{ride.rating}</span>
                          </div>
                          <div className="text-lg font-bold text-primary">₹{ride.price}</div>
                          <p className="text-sm text-gray-500">
                            {ride.seatsAvailable} seats available
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t flex justify-between items-center flex-wrap gap-3">
                        <div className="flex items-center">
                          <Car className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-600">{ride.carModel}</span>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={handleBookRide}
                          className="bg-primary hover:bg-primary/90"
                        >
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No scheduled rides yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We don't have any rides scheduled for this route at the moment. Please check back later or set an alert to be notified when rides become available.
                </p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Route Reviews</h2>
            
            <div className="bg-white border rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="text-5xl font-bold text-primary">4.7</div>
                <div className="ml-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-5 w-5 ${star <= 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mt-1">Based on 124 reviews</p>
                </div>
              </div>
              
              <div className="space-y-4 mt-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">Rahul M.</h3>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${star <= 5 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Comfortable ride from {from} to {to}. The driver was punctual and professional. The car was clean and well-maintained. Will recommend!
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">Priya S.</h3>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${star <= 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Great value for money. The route was scenic and the driver shared interesting facts about places we passed through. Overall a pleasant experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteDetailsPage;
