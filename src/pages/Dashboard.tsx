import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Calendar, Clock, Users, Car, LocateFixed, 
  IndianRupee, Star, AlertCircle, Search, Shield, PlusCircle, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { popularDestinations } from '@/data/destinations';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import RideCard from '@/components/RideCard';
import RideDetails from '@/components/RideDetails';
import LiveTrackingDemo from '@/components/LiveTrackingDemo';
import { rides as defaultRides, Ride } from '@/data/rides';
import OfferRideForm from '@/components/OfferRideForm';
import DriverVerification from '@/components/DriverVerification';
import BookingNotifications from '@/components/BookingNotifications';
import { connectSocket } from '../lib/socket';
import TestComponent from '../components/TestComponent';
import RideManagement from '@/components/RideManagement';

interface UserInfo {
  name: string;
  email: string;
  role: string;
  id?: string; // Add id property as optional
}

interface DashboardProps {
  userType?: 'driver' | 'passenger';
}

const Dashboard: React.FC<DashboardProps> = ({ userType }) => {
  // Fix: initialize currentUser with default values without self-reference
  const [currentUser, setCurrentUser] = useState<UserInfo | null>({
    name: "Team ELITE TN",
    email: "",
    role: "passenger"
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [showRideDetails, setShowRideDetails] = useState(false);
  const [activeBookings, setActiveBookings] = useState<Ride[]>([]);
  const [myRides, setMyRides] = useState<Ride[]>([]);
  const [showOfferRideForm, setShowOfferRideForm] = useState(false);
  const [isDriverVerified, setIsDriverVerified] = useState(false);
  const [showDriverVerification, setShowDriverVerification] = useState(false);
  const [allRides, setAllRides] = useState<Ride[]>([]);
  const [showRideManagement, setShowRideManagement] = useState(false);
  const [managedRide, setManagedRide] = useState<Ride | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userStr = localStorage.getItem('elitecars_current_user');
    if (!userStr) {
      toast({
        title: "Authentication required",
        description: "Please sign in to continue",
        variant: "destructive"
      });
      navigate('/signin');
      return;
    }
    
    const user = JSON.parse(userStr) as UserInfo;
    setCurrentUser(user);
    
    if (user.role === 'driver') {
      const verificationStatus = localStorage.getItem('elitecars_driver_verified');
      setIsDriverVerified(verificationStatus === 'true');
    }
    
    loadAllRides();

    const searchParams = localStorage.getItem('elitecars_search');
    if (searchParams) {
      const params = JSON.parse(searchParams);
      handleSearchWithParams(params);
      localStorage.removeItem('elitecars_search');
    } else {
      filterRidesByUserRole(user.role);
    }

    loadMyRides(user);

    const bookingsStr = localStorage.getItem('elitecars_bookings');
    if (bookingsStr) {
      setActiveBookings(JSON.parse(bookingsStr));
    }

    // Comment out socket connection for now
    /*
    if (user && user.id) {
      const disconnect = connectSocket(
        user.id, 
        user.role as 'passenger' | 'driver'
      );
      
      return () => {
        disconnect();
      };
    }
    */
  }, [navigate, toast]);
  
  const loadAllRides = () => {
    let allAvailableRides = [...defaultRides];
    
    const offeredRidesStr = localStorage.getItem('elitecars_offered_rides');
    if (offeredRidesStr) {
      const offeredRides = JSON.parse(offeredRidesStr);
      allAvailableRides = [...allAvailableRides, ...offeredRides];
    }
    
    setAllRides(allAvailableRides);
  };
  
  const loadMyRides = (user: UserInfo) => {
    if (user.role === 'passenger') {
      const myBookingsStr = localStorage.getItem('elitecars_bookings');
      if (myBookingsStr) {
        setMyRides(JSON.parse(myBookingsStr));
      }
    } else {
      const offeredRidesStr = localStorage.getItem('elitecars_offered_rides');
      if (offeredRidesStr) {
        const offeredRides = JSON.parse(offeredRidesStr);
        setMyRides(offeredRides.filter((ride: Ride) => ride.driverName === user.name));
      }
    }
  };
  
  const filterRidesByUserRole = (role: string) => {
    if (role === 'passenger') {
      setFilteredRides(allRides.filter(ride => ride.seatsAvailable > 0));
    } else {
      const userOfferedRides = allRides.filter(ride => {
        const user = JSON.parse(localStorage.getItem('elitecars_current_user') || '{}');
        return ride.driverName === user.name;
      });
      
      setFilteredRides(userOfferedRides);
    }
  };

  const handleSearchWithParams = (params: any) => {
    const filtered = allRides.filter(ride => {
      const matchesFrom = !params.from || ride.from.toLowerCase().includes(params.from.toLowerCase());
      const matchesTo = !params.to || ride.to.toLowerCase().includes(params.to.toLowerCase());
      return matchesFrom && matchesTo;
    });
    
    setFilteredRides(filtered);
    
    toast({
      title: `${filtered.length} rides found`,
      description: filtered.length > 0 
        ? `Found rides ${params.from ? 'from ' + params.from : ''} ${params.to ? 'to ' + params.to : ''}` 
        : "No rides found for your search criteria"
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      if (currentUser?.role === 'passenger') {
        setFilteredRides(allRides.filter(ride => ride.seatsAvailable > 0));
      } else {
        setFilteredRides(allRides);
      }
      return;
    }
    
    const filtered = allRides.filter(ride => 
      ride.from.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ride.to.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredRides(filtered);
    
    toast({
      title: `${filtered.length} rides found`,
      description: filtered.length > 0 
        ? "Found rides matching your search" 
        : "No rides found for your search criteria"
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('elitecars_current_user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
    navigate('/');
  };
  
  const handleRideAction = (ride: Ride, action: 'book' | 'offer' | 'details' | 'manage') => {
    if (action === 'book' || action === 'details') {
      setSelectedRide(ride);
      setShowRideDetails(true);
    } else if (action === 'manage') {
      setManagedRide(ride);
      setShowRideManagement(true);
    } else if (action === 'offer') {
      toast({
        title: "Ride management",
        description: `Managing your ride from ${ride.from} to ${ride.to}.`,
      });
    }
  };

  const handleBookingComplete = (ride: Ride) => {
    const newBookings = [...activeBookings, ride];
    const updatedMyRides = [...myRides, ride];
    
    setActiveBookings(newBookings);
    setMyRides(updatedMyRides);
    
    localStorage.setItem('elitecars_bookings', JSON.stringify(newBookings));
    
    toast({
      title: "Booking confirmed",
      description: `Your ride from ${ride.from} to ${ride.to} is confirmed.`,
    });
    
    setShowRideDetails(false);
  };
  
  const handleOfferRide = () => {
    if (currentUser?.role !== 'driver') {
      toast({
        title: "Not a driver",
        description: "You need to be registered as a driver to offer rides.",
        variant: "destructive"
      });
      return;
    }
    
    if (!isDriverVerified) {
      setShowDriverVerification(true);
    } else {
      setShowOfferRideForm(true);
    }
  };
  
  const handleDriverVerified = (verified: boolean) => {
    setIsDriverVerified(verified);
    localStorage.setItem('elitecars_driver_verified', 'true');
    setShowDriverVerification(false);
    
    if (verified) {
      setShowOfferRideForm(true);
    }
  };
  
  const handleRideOfferComplete = () => {
    setShowOfferRideForm(false);
    loadAllRides();
    
    if (currentUser) {
      loadMyRides(currentUser);
    }
    
    filterRidesByUserRole(currentUser?.role || 'passenger');
    
    toast({
      title: "Ride offered successfully",
      description: "Your ride has been added to the available rides.",
    });
  };

  const handleRideUpdate = (updatedRide: Ride) => {
    // Update ride in state
    const updatedAllRides = allRides.map(ride => 
      ride.id === updatedRide.id ? updatedRide : ride
    );
    setAllRides(updatedAllRides);
    
    const updatedMyRides = myRides.map(ride => 
      ride.id === updatedRide.id ? updatedRide : ride
    );
    setMyRides(updatedMyRides);
    
    const updatedFilteredRides = filteredRides.map(ride => 
      ride.id === updatedRide.id ? updatedRide : ride
    );
    setFilteredRides(updatedFilteredRides);
    
    toast({
      title: "Ride updated",
      description: `Your ride from ${updatedRide.from} to ${updatedRide.to} has been updated.`,
    });
  };

  const handleRideDelete = (rideId: number) => {
    // Remove ride from state
    const updatedAllRides = allRides.filter(ride => ride.id !== rideId);
    setAllRides(updatedAllRides);
    
    const updatedMyRides = myRides.filter(ride => ride.id !== rideId);
    setMyRides(updatedMyRides);
    
    const updatedFilteredRides = filteredRides.filter(ride => ride.id !== rideId);
    setFilteredRides(updatedFilteredRides);
    
    setShowRideManagement(false);
    
    toast({
      title: "Ride deleted",
      description: "Your ride has been deleted successfully.",
    });
  };

  if (!currentUser) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">
                Elite<span className="text-accent">Cars</span>
              </h1>
              <span className="ml-2 text-sm text-muted-foreground">
                Hello, Team ELITE TN
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="font-medium bg-primary/10">
                {currentUser.role === 'passenger' ? (
                  <Users className="mr-1 h-4 w-4" />
                ) : (
                  <Car className="mr-1 h-4 w-4" />
                )}
                {currentUser.role === 'passenger' ? 'Passenger' : 'Driver'}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          <Card className="border-none shadow-lg bg-gradient-to-r from-primary/90 to-primary/70 text-white">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold mb-2">
                    Welcome back, Team ELITE TN!
                  </h2>
                  <p className="opacity-90 mb-4">
                    {currentUser.role === 'passenger' 
                      ? 'Find your perfect ride with trusted drivers across India.' 
                      : 'Offer rides and earn money while helping others travel conveniently.'}
                  </p>
                </div>
                
                {currentUser.role === 'driver' && (
                  <Button 
                    onClick={handleOfferRide}
                    className="bg-accent text-secondary hover:bg-accent/90 shadow-md"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Offer a Ride
                  </Button>
                )}
              </div>
              
              <form onSubmit={handleSearch} className="relative mt-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-primary" />
                <Input 
                  type="text" 
                  placeholder="Search rides by city or destination..." 
                  className="pl-10 bg-white text-gray-800 border-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1"
                >
                  Search
                </Button>
              </form>
            </CardContent>
          </Card>

          <Tabs defaultValue="available-rides" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
              <TabsTrigger value="available-rides" className="text-sm">
                {currentUser.role === 'passenger' ? 'Available Rides' : 'Manage Rides'}
              </TabsTrigger>
              <TabsTrigger value="my-rides" className="text-sm">
                My Rides
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="available-rides" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRides.length > 0 ? (
                  filteredRides.map((ride) => (
                    <RideCard 
                      key={ride.id}
                      ride={ride}
                      userRole={currentUser.role}
                      onAction={(action) => handleRideAction(ride, action)}
                    />
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center bg-white rounded-lg p-8 border border-dashed border-gray-300">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No rides found</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      {currentUser.role === 'passenger' 
                        ? 'No rides are currently available for your search criteria. Try a different location or check back later.'
                        : 'You haven\'t offered any rides yet. Create your first ride offer to get started.'}
                    </p>
                    {currentUser.role === 'driver' && (
                      <Button className="mt-4" onClick={handleOfferRide}>
                        Offer a Ride
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="my-rides" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myRides.length > 0 ? (
                  myRides.map((ride) => (
                    <RideCard 
                      key={`myride-${ride.id}`}
                      ride={ride}
                      userRole={currentUser.role}
                      onAction={(action) => handleRideAction(ride, action)}
                    />
                  ))
                ) : (
                  <div className="col-span-full bg-white rounded-lg p-8 shadow-sm text-center">
                    <h3 className="text-lg font-medium mb-2">No rides yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      {currentUser.role === 'passenger' 
                        ? 'You haven\'t booked any rides yet. Find available rides and make your first booking!'
                        : 'You haven\'t offered any rides yet. Start offering rides to build your history.'}
                    </p>
                    {currentUser.role === 'driver' && (
                      <Button className="mt-4" onClick={handleOfferRide}>
                        Offer a Ride
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <section>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <span className="bg-primary/10 text-primary p-2 rounded-full mr-3">
                  <MapPin size={18} />
                </span>
                Popular Routes
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {popularDestinations.slice(0, 3).map((destination) => (
                  <Card key={destination.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                    <div 
                      className="h-40 bg-cover bg-center"
                      style={{ backgroundImage: `url(${destination.imageUrl})` }}
                    >
                      <div className="h-full w-full bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                        <div className="text-white">
                          <p className="font-medium">{destination.from} to {destination.to}</p>
                          <div className="flex items-center mt-1">
                            <IndianRupee className="h-4 w-4 mr-1" />
                            <span className="font-bold">{destination.price}</span>
                            <span className="mx-2">•</span>
                            <Users className="h-4 w-4 mr-1" />
                            <span>{destination.rideCount}+ rides</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          localStorage.setItem('elitecars_search', JSON.stringify({ 
                            from: destination.from, 
                            to: destination.to 
                          }));
                          navigate('/all-routes');
                        }}
                      >
                        {currentUser.role === 'passenger' ? 'Find Rides' : 'Offer Ride'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {activeBookings.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  <span className="bg-primary/10 text-primary p-2 rounded-full mr-3">
                    <LocateFixed size={18} />
                  </span>
                  Your Active Journey
                </h2>
                <div className="bg-white rounded-xl shadow-md p-6">
                  <LiveTrackingDemo />
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      {showRideDetails && selectedRide && (
        <RideDetails 
          ride={selectedRide} 
          onClose={() => setShowRideDetails(false)} 
          onBookingComplete={handleBookingComplete}
        />
      )}

      {showRideManagement && managedRide && (
        <RideManagement
          ride={managedRide}
          onClose={() => setShowRideManagement(false)}
          onUpdate={handleRideUpdate}
          onDelete={handleRideDelete}
        />
      )}

      {showOfferRideForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-3xl w-full mx-auto">
            <OfferRideForm onClose={() => setShowOfferRideForm(false)} />
          </div>
        </div>
      )}

      {showDriverVerification && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-lg w-full mx-auto">
            <DriverVerification onVerified={handleDriverVerified} />
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-none shadow-md bg-white overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="text-lg flex items-center">
              <Shield className="mr-2 text-primary" size={18} />
              Trust & Safety Features
            </CardTitle>
            <CardDescription>
              Your safety is our highest priority
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Verified Users</h3>
                <p className="text-sm text-gray-600">
                  All users undergo rigorous identity verification through Aadhaar, ensuring safety and trust.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <LocateFixed className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Live Tracking</h3>
                <p className="text-sm text-gray-600">
                  Track your ride in real-time and share your location with trusted contacts for added security.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Ratings & Reviews</h3>
                <p className="text-sm text-gray-600">
                  Our community-based rating system helps maintain high quality standards for all rides.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;






