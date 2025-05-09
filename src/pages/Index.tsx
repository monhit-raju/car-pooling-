
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import SearchForm from '@/components/SearchForm';
import FeatureCard from '@/components/FeatureCard';
import DestinationCard from '@/components/DestinationCard';
import TestimonialCard from '@/components/TestimonialCard';
import HowItWorks from '@/components/HowItWorks';
import Footer from '@/components/Footer';
import LiveTrackingDemo from '@/components/LiveTrackingDemo';
import CustomerServiceBanner from '@/components/CustomerServiceBanner';
import RouteDetailsPage from '@/components/RouteDetailsPage';
import { 
  Shield, 
  Clock, 
  CreditCard, 
  Users, 
  Car, 
  Navigation, 
  MessageSquare, 
  Zap 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { popularDestinations } from '@/data/destinations';
import { isAuthenticated } from '@/lib/auth';

const Index = () => {
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState<null | {
    from: string;
    to: string;
    price: string;
    imageUrl: string;
    rideCount: number;
  }>(null);
  
  // Feature Data
  const features = [
    {
      title: 'Safe & Secure',
      description: 'Verified drivers and passengers with ratings and reviews for your peace of mind.',
      icon: Shield,
      color: 'primary'
    },
    {
      title: 'Flexible Scheduling',
      description: 'Find rides that match your schedule or set your own times as a driver.',
      icon: Clock,
      color: 'accent'
    },
    {
      title: 'Cashless Payments',
      description: 'Secure online payments with multiple options for convenience.',
      icon: CreditCard,
      color: 'secondary'
    },
    {
      title: 'Connect with People',
      description: 'Meet like-minded travelers and expand your network during your journey.',
      icon: Users,
      color: 'primary'
    },
    {
      title: 'Premium Vehicles',
      description: 'Travel in comfort with our elite selection of well-maintained vehicles.',
      icon: Car,
      color: 'accent'
    },
    {
      title: 'Real-time Tracking',
      description: 'Track your ride in real-time and share your journey with loved ones.',
      icon: Navigation,
      color: 'secondary'
    }
  ];
  
  // Testimonials Data
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Regular Passenger',
      comment: 'Elite Cars has transformed my daily commute. The drivers are professional and the cars are always clean and comfortable.',
      rating: 5,
      avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      name: 'David Smith',
      role: 'Business Traveler',
      comment: "The best carpooling service I've ever used. Their flexible scheduling has saved me countless hours of waiting.",
      rating: 4,
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      name: 'Michael Wong',
      role: 'Weekend Driver',
      comment: 'I drive during weekends to offset my car expenses. The platform is user-friendly and support is always responsive.',
      rating: 5,
      avatarUrl: 'https://randomuser.me/api/portraits/men/67.jpg'
    }
  ];
  
  // App Benefits Data
  const appBenefits = [
    {
      title: 'Instant Booking',
      description: 'Book your ride with just a few taps on our mobile app.',
      icon: Zap
    },
    {
      title: 'In-app Chat',
      description: 'Communicate with your driver or passengers before your trip.',
      icon: MessageSquare
    }
  ];
  
  const handleViewRouteDetails = (destination: any) => {
    setSelectedRoute(destination);
    window.scrollTo(0, 0);
  };
  
  const handleCloseRouteDetails = () => {
    setSelectedRoute(null);
  };
  
  const handleExploreAllRoutes = () => {
    navigate('/all-routes');
  };
  
  // If a route is selected, display route details page
  if (selectedRoute) {
    return (
      <RouteDetailsPage 
        from={selectedRoute.from}
        to={selectedRoute.to}
        price={selectedRoute.price}
        imageUrl={selectedRoute.imageUrl}
        rideCount={selectedRoute.rideCount}
        onClose={handleCloseRouteDetails}
      />
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Advanced Search Form - Positioned with appropriate spacing */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-24 relative z-20">
          <SearchForm />
        </div>
        
        {/* 24/7 Customer Service Banner - Moved below the search form */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10">
          <CustomerServiceBanner />
        </div>
        
        {/* Features Section */}
        <section id="features" className="py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Why Choose Elite Cars
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We offer a premium carpooling experience with features designed for comfort, 
                convenience, and safety.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard 
                  key={index}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  color={feature.color}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Live Tracking Section */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Live Tracking
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Know exactly where your ride is with our advanced real-time tracking feature.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <LiveTrackingDemo />
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <HowItWorks />
        
        {/* Popular Destinations */}
        <section id="destinations" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Popular Routes
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover our most traveled routes with frequent rides and competitive prices.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {popularDestinations.map((destination, index) => (
                <DestinationCard 
                  key={index}
                  from={destination.from}
                  to={destination.to}
                  price={destination.price}
                  imageUrl={destination.imageUrl}
                  rideCount={destination.rideCount}
                  onViewDetails={() => handleViewRouteDetails(destination)}
                />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button 
                variant="outline" 
                className="px-8"
                onClick={handleExploreAllRoutes}
              >
                Explore All Routes
              </Button>
            </div>
          </div>
        </section>
        
        {/* App Download Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Download the Elite Cars App
                </h2>
                <p className="text-xl opacity-90 mb-8">
                  Get the full experience with our mobile app. Book rides, track journeys, 
                  and manage your profile on the go.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  {appBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-white/20 rounded-full p-3 flex-shrink-0">
                        <benefit.icon size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                        <p className="opacity-80 text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <a href="#" className="bg-black hover:bg-gray-900 transition-colors rounded-lg px-5 py-3 flex items-center space-x-3">
                    <div className="text-left">
                      <p className="text-xs">Download on the</p>
                      <p className="text-base font-semibold">App Store</p>
                    </div>
                  </a>
                  <a href="#" className="bg-black hover:bg-gray-900 transition-colors rounded-lg px-5 py-3 flex items-center space-x-3">
                    <div className="text-left">
                      <p className="text-xs">Get it on</p>
                      <p className="text-base font-semibold">Google Play</p>
                    </div>
                  </a>
                </div>
              </div>
              
              <div className="flex justify-center">
                {/* Phone mockup image */}
                <div className="relative h-[500px] w-[250px] bg-white rounded-3xl shadow-2xl border-8 border-gray-800 overflow-hidden">
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-2">
                        Elite<span className="text-accent">Cars</span>
                      </div>
                      <p className="text-gray-500 text-sm">App Screenshot</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section id="testimonials" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                What Our Users Say
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join thousands of satisfied users who trust Elite Cars for their carpooling needs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard 
                  key={index}
                  name={testimonial.name}
                  role={testimonial.role}
                  comment={testimonial.comment}
                  rating={testimonial.rating}
                  avatarUrl={testimonial.avatarUrl}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-accent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Ready to Experience Elite Carpooling?
            </h2>
            <p className="text-slate-800 max-w-2xl mx-auto mb-8 text-lg">
              Join our community today and enjoy comfortable, affordable, and eco-friendly rides.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800">
                Sign Up Now
              </Button>
              <Button size="lg" variant="outline" className="border-slate-900 text-slate-900 hover:bg-slate-900/10">
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;









