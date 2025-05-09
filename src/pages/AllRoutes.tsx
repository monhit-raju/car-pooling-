import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import RideCard from '@/components/RideCard';
import RouteDetailsPage from '@/components/RouteDetailsPage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, MapPin } from 'lucide-react';
import { popularDestinations } from '@/data/destinations';
import { rides as allRides, Ride } from '@/data/rides';
import { useToast } from '@/hooks/use-toast';
import { isAuthenticated } from '@/lib/auth';

const AllRoutes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRides, setFilteredRides] = useState<Ride[]>(allRides);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  useEffect(() => {
    // Apply initial filtering
    handleFilterChange('all');
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setFilteredRides(allRides);
      return;
    }
    
    const filtered = allRides.filter(ride => 
      ride.from.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ride.to.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredRides(filtered);
    
    toast({
      title: `${filtered.length} routes found`,
      description: filtered.length > 0 
        ? "Found routes matching your search" 
        : "No routes found for your search criteria"
    });
  };
  
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    
    let filtered: Ride[];
    
    switch (filter) {
      case 'popular':
        // Get routes that match popular destinations
        const popularRoutes = popularDestinations.map(dest => `${dest.from}-${dest.to}`);
        filtered = allRides.filter(ride => 
          popularRoutes.includes(`${ride.from}-${ride.to}`)
        );
        break;
      case 'price-low':
        filtered = [...allRides].sort((a, b) => 
          parseInt(a.price.replace(/,/g, '')) - parseInt(b.price.replace(/,/g, ''))
        );
        break;
      case 'price-high':
        filtered = [...allRides].sort((a, b) => 
          parseInt(b.price.replace(/,/g, '')) - parseInt(a.price.replace(/,/g, ''))
        );
        break;
      case 'seats':
        filtered = [...allRides].sort((a, b) => b.seatsAvailable - a.seatsAvailable);
        break;
      default:
        filtered = allRides;
    }
    
    setFilteredRides(filtered);
  };
  
  const handleRideAction = (ride: Ride, action: 'book' | 'details') => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication required",
        description: "Please sign in to view ride details or book a ride",
        variant: "destructive"
      });
      navigate('/signin');
      return;
    }
    
    setSelectedRide(ride);
  };
  
  const handleCloseDetails = () => {
    setSelectedRide(null);
  };
  
  // If a ride is selected, display its details
  if (selectedRide) {
    return (
      <RouteDetailsPage 
        from={selectedRide.from}
        to={selectedRide.to}
        price={selectedRide.price}
        imageUrl={selectedRide.imageUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"}
        rideCount={25}
        onClose={handleCloseDetails}
      />
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore All Routes</h1>
            <p className="text-gray-600">
              Discover all available routes and find your perfect ride
            </p>
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  type="text" 
                  placeholder="Search by city or destination..." 
                  className="pl-10 pr-24 py-6 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit"
                  size="lg"
                  className="absolute right-1 top-1"
                >
                  Search
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="mb-6 flex flex-wrap gap-2">
            <Button 
              variant={activeFilter === 'all' ? 'default' : 'outline'} 
              onClick={() => handleFilterChange('all')}
              className="rounded-full"
            >
              All Routes
            </Button>
            <Button 
              variant={activeFilter === 'popular' ? 'default' : 'outline'} 
              onClick={() => handleFilterChange('popular')}
              className="rounded-full"
            >
              Popular
            </Button>
            <Button 
              variant={activeFilter === 'price-low' ? 'default' : 'outline'} 
              onClick={() => handleFilterChange('price-low')}
              className="rounded-full"
            >
              Price: Low to High
            </Button>
            <Button 
              variant={activeFilter === 'price-high' ? 'default' : 'outline'} 
              onClick={() => handleFilterChange('price-high')}
              className="rounded-full"
            >
              Price: High to Low
            </Button>
            <Button 
              variant={activeFilter === 'seats' ? 'default' : 'outline'} 
              onClick={() => handleFilterChange('seats')}
              className="rounded-full"
            >
              Most Seats Available
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRides.length > 0 ? (
              filteredRides.map((ride) => (
                <RideCard 
                  key={ride.id}
                  ride={ride}
                  userRole="passenger"
                  onAction={(action) => handleRideAction(ride, action)}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center bg-white rounded-lg p-8 border border-dashed border-gray-300">
                <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No routes found</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  No routes match your search criteria. Try adjusting your search or filters.
                </p>
              </div>
            )}
          </div>
          
          {filteredRides.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-gray-500 mb-2">
                Showing {filteredRides.length} of {allRides.length} routes
              </p>
              {/* Dashboard button removed */}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AllRoutes;
