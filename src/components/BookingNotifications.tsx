import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from '@/hooks/use-toast';
import { Check, X, Bell, User, Calendar, Clock, MapPin } from 'lucide-react';
import { socket } from '../lib/socket';
import ApiService from '../lib/api';

interface BookingNotification {
  bookingId: string;
  ride: {
    from: string;
    to: string;
    date: string;
    departureTime: string;
  };
  passenger: {
    name: string;
    email: string;
  };
  seatsBooked: number;
  status: 'pending' | 'accepted' | 'rejected';
}

const BookingNotifications = () => {
  const [notifications, setNotifications] = useState<BookingNotification[]>([]);
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    // Load existing pending bookings
    const fetchPendingBookings = async () => {
      try {
        const bookings = await ApiService.getDriverBookings();
        const pendingBookings = bookings.filter(booking => booking.status === 'pending');
        setNotifications(pendingBookings);
      } catch (error) {
        console.error('Failed to fetch pending bookings:', error);
      }
    };

    fetchPendingBookings();

    // Listen for new booking notifications
    socket.on('new_booking', (booking: BookingNotification) => {
      setNotifications(prev => [...prev, booking]);
      
      toast({
        title: "New Booking Request",
        description: `${booking.passenger.name} wants to book ${booking.seatsBooked} seat(s) from ${booking.ride.from} to ${booking.ride.to}`,
      });
    });

    return () => {
      socket.off('new_booking');
    };
  }, []);

  const handleBookingAction = async (bookingId: string, action: 'accepted' | 'rejected') => {
    setIsLoading(prev => ({ ...prev, [bookingId]: true }));
    
    try {
      await ApiService.updateBookingStatus(bookingId, action);
      
      // Update local state
      setNotifications(prev => 
        prev.filter(notification => notification.bookingId !== bookingId)
      );
      
      toast({
        title: `Booking ${action === 'accepted' ? 'Accepted' : 'Rejected'}`,
        description: `You have ${action === 'accepted' ? 'accepted' : 'rejected'} the booking request.`,
      });
    } catch (error) {
      console.error(`Failed to ${action} booking:`, error);
      toast({
        title: "Action Failed",
        description: `Failed to ${action} the booking. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-lg font-semibold flex items-center">
        <Bell className="mr-2 h-5 w-5 text-accent" />
        Booking Requests
      </h3>
      
      {notifications.map((notification) => (
        <Card key={notification.bookingId} className="border-l-4 border-l-accent animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <User className="mr-2 h-4 w-4" />
              {notification.passenger.name}
              <Badge variant="outline" className="ml-auto">
                {notification.seatsBooked} {notification.seatsBooked === 1 ? 'seat' : 'seats'}
              </Badge>
            </CardTitle>
            <CardDescription className="text-sm">
              <div className="flex items-center">
                <MapPin className="mr-1 h-3 w-3" />
                {notification.ride.from} to {notification.ride.to}
              </div>
              <div className="flex items-center mt-1">
                <Calendar className="mr-1 h-3 w-3" />
                {notification.ride.date}
                <Clock className="ml-2 mr-1 h-3 w-3" />
                {notification.ride.departureTime}
              </div>
            </CardDescription>
          </CardHeader>
          <CardFooter className="pt-2">
            <div className="flex space-x-2 w-full">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 border-red-200 hover:bg-red-50 hover:text-red-600"
                onClick={() => handleBookingAction(notification.bookingId, 'rejected')}
                disabled={isLoading[notification.bookingId]}
              >
                <X className="mr-1 h-4 w-4" />
                Reject
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 border-green-200 hover:bg-green-50 hover:text-green-600"
                onClick={() => handleBookingAction(notification.bookingId, 'accepted')}
                disabled={isLoading[notification.bookingId]}
              >
                <Check className="mr-1 h-4 w-4" />
                Accept
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default BookingNotifications;
