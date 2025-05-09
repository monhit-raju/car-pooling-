import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Ride } from '@/lib/types';
import { format } from 'date-fns';
import { CalendarIcon, Clock, MapPin } from 'lucide-react';
import ApiService from '@/lib/api';
import { useToast } from './ui/use-toast';

interface BookingModalProps {
  ride: Ride | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ ride, isOpen, onClose, onSuccess }) => {
  const [seats, setSeats] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (!ride) return null;

  const totalPrice = ride.price * seats;

  const handleBooking = async () => {
    if (!ride) return;
    
    setIsLoading(true);
    try {
      await ApiService.createBooking(ride.id, seats);
      toast({
        title: "Booking successful!",
        description: "Your ride has been booked successfully.",
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Booking failed",
        description: error.message || "Failed to book the ride. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Your Ride</DialogTitle>
          <DialogDescription>
            Confirm your booking details below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {ride.from} to {ride.to}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {format(new Date(ride.departureTime), 'PPP')}
              <Clock className="h-4 w-4 ml-3 mr-1" />
              {format(new Date(ride.departureTime), 'p')}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="seats">Number of seats</Label>
            <Input
              id="seats"
              type="number"
              min={1}
              max={ride.availableSeats}
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value) || 1)}
            />
            <p className="text-xs text-muted-foreground">
              {ride.availableSeats} seats available
            </p>
          </div>
          
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <span>Price per seat:</span>
              <span>${ride.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center font-bold mt-2">
              <span>Total price:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleBooking} disabled={isLoading}>
            {isLoading ? "Processing..." : "Confirm Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;