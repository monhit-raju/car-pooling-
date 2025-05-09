import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ride } from '@/data/rides';
import { 
  Car, Calendar, Clock, MapPin, User, Phone, MessageSquare, 
  Shield, Star, IndianRupee, Users, Tag, Percent, Info
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import LiveTrackingDemo from './LiveTrackingDemo';
import PassengerDetailsForm, { PassengerDetail } from './PassengerDetailsForm';
import PaymentPage from './payment/PaymentPage';
import { useToast } from '@/hooks/use-toast';

interface RideDetailsProps {
  ride: Ride;
  onClose: () => void;
  onBookingComplete?: (ride: Ride) => void;
}

const RideDetails: React.FC<RideDetailsProps> = ({ ride, onClose, onBookingComplete }) => {
  const [step, setStep] = useState<'details' | 'passenger-details' | 'payment' | 'tracking'>('details');
  const [passengerDetails, setPassengerDetails] = useState<PassengerDetail[]>([]);
  const [seatsBooked, setSeatsBooked] = useState(0);
  const { toast } = useToast();

  // Simple direct functions to change steps
  const goToPassengerDetails = () => setStep('passenger-details');
  const goToDetails = () => setStep('details');
  const goToPayment = () => setStep('payment');
  const goToTracking = () => setStep('tracking');

  const handlePassengerDetailsComplete = (details: PassengerDetail[], seats: number) => {
    setPassengerDetails(details);
    setSeatsBooked(seats);
    goToPayment();
  };

  const handlePaymentComplete = () => {
    goToTracking();
    
    // Save booking to localStorage
    const bookings = JSON.parse(localStorage.getItem('elitecars_bookings') || '[]');
    bookings.push({
      id: Date.now(),
      ride: ride,
      passengerDetails: passengerDetails,
      seatsBooked: seatsBooked,
      date: new Date().toISOString()
    });
    localStorage.setItem('elitecars_bookings', JSON.stringify(bookings));
    
    if (onBookingComplete) {
      onBookingComplete(ride);
    }
    
    toast({
      title: "Booking Confirmed",
      description: `Your ride from ${ride.from} to ${ride.to} has been booked successfully.`,
    });
  };

  // Render different components based on step
  const renderStepContent = () => {
    switch (step) {
      case 'details':
        return (
          <Card className="shadow-xl border-none">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-slate-800 flex items-center">
                    <Car className="mr-2 text-primary" size={20} />
                    Ride Details
                  </CardTitle>
                  <CardDescription>
                    {ride.from} to {ride.to} on {ride.date}
                  </CardDescription>
                </div>
                <Badge variant={ride.verified ? "default" : "outline"} className="ml-2">
                  {ride.verified ? (
                    <Shield className="h-3 w-3 mr-1 text-primary-foreground" />
                  ) : null}
                  {ride.verified ? 'Verified Ride' : 'Standard Ride'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Route Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">{ride.from}</p>
                        <p className="text-sm text-gray-500">{ride.fromDetail}</p>
                      </div>
                    </div>
                    
                    <div className="border-l-2 border-dashed border-gray-200 h-6 ml-2.5"></div>
                    
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">{ride.to}</p>
                        <p className="text-sm text-gray-500">{ride.toDetail}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                      <p>{ride.date}</p>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-500 mr-3" />
                      <p>{ride.departureTime} - {ride.arrivalTime}</p>
                    </div>
                    
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-500 mr-3" />
                      <p>{ride.seatsAvailable} seats available</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Driver & Vehicle</h3>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">{ride.driverName}</p>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm ml-1">{ride.driverRating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Car className="h-5 w-5 text-gray-500 mr-3" />
                      <p>{ride.carModel}</p>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-500 mr-3" />
                      <p>Contact available after booking</p>
                    </div>
                    
                    <div className="flex items-center">
                      <MessageSquare className="h-5 w-5 text-gray-500 mr-3" />
                      <p>In-app messaging available</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-900 mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {ride.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-100">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">Price</h3>
                    <p className="text-sm text-gray-500">Per passenger</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <IndianRupee className="h-5 w-5 text-gray-900" />
                      <span className="text-2xl font-bold">{ride.price}</span>
                    </div>
                    <div className="flex items-center text-sm text-green-600">
                      <Tag className="h-4 w-4 mr-1" />
                      <span>Best price guaranteed</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                  <div className="flex items-center">
                    <Percent className="h-5 w-5 text-primary mr-2" />
                    <p className="text-sm">
                      <span className="font-medium">Special offer:</span> Use code WELCOME10 for 10% off your first ride
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="bg-gray-50 border-t border-gray-200 flex-col gap-4 sm:flex-row">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Back
              </Button>
              <Button 
                className="flex-1"
                onClick={goToPassengerDetails}
              >
                Book Now
                <IndianRupee className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
        
      case 'passenger-details':
        return (
          <Card className="shadow-xl border-none">
            <CardContent className="p-0">
              <PassengerDetailsForm
                ride={ride}
                onComplete={handlePassengerDetailsComplete}
                onCancel={goToDetails}
              />
            </CardContent>
          </Card>
        );
        
      case 'payment':
        return (
          <Card className="shadow-xl border-none">
            <CardContent className="p-0">
              <PaymentPage 
                ride={ride}
                passengerDetails={passengerDetails}
                onPaymentComplete={handlePaymentComplete}
                onCancel={goToPassengerDetails}
              />
            </CardContent>
          </Card>
        );
        
      case 'tracking':
        return (
          <div>
            <Card className="shadow-xl border-none mb-4">
              <CardHeader>
                <CardTitle className="text-lg">
                  Booking Confirmed - Track Your Ride
                </CardTitle>
                <CardDescription>
                  Your ride from {ride.from} to {ride.to} is confirmed for {ride.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LiveTrackingDemo />
                
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center mb-2">
                    <Info className="text-green-600 mr-2" size={18} />
                    <h4 className="font-medium text-green-800">How It Works</h4>
                  </div>
                  <p className="text-green-700 text-sm">
                    On the day of your ride, you'll be able to track your driver in real-time. 
                    You can share your live location with trusted contacts for enhanced safety.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-200 p-4">
                <Button onClick={onClose} className="w-full">
                  Back to Dashboard
                </Button>
              </CardFooter>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="max-w-3xl w-full mx-auto">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default RideDetails;

