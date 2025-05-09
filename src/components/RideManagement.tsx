import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ride } from '@/data/rides';
import { 
  Car, Calendar, Clock, MapPin, Users, IndianRupee, 
  X, Edit, Trash2, CheckCircle, AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface RideManagementProps {
  ride: Ride;
  onClose: () => void;
  onUpdate: (updatedRide: Ride) => void;
  onDelete: (rideId: number) => void; // Change to number
}

const RideManagement: React.FC<RideManagementProps> = ({ 
  ride, 
  onClose, 
  onUpdate,
  onDelete 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const { toast } = useToast();
  
  // Load bookings for this ride
  React.useEffect(() => {
    const allBookingsStr = localStorage.getItem('elitecars_bookings') || '[]';
    const allBookings = JSON.parse(allBookingsStr);
    const rideBookings = allBookings.filter((booking: any) => booking.rideId === ride.id);
    setBookings(rideBookings);
  }, [ride.id]);
  
  const handleStatusChange = (status: 'active' | 'completed' | 'cancelled') => {
    const updatedRide = { ...ride, status };
    
    // Update ride in localStorage
    const ridesStr = localStorage.getItem('elitecars_offered_rides') || '[]';
    const rides = JSON.parse(ridesStr);
    const updatedRides = rides.map((r: Ride) => r.id === ride.id ? updatedRide : r);
    localStorage.setItem('elitecars_offered_rides', JSON.stringify(updatedRides));
    
    onUpdate(updatedRide);
    
    toast({
      title: "Ride status updated",
      description: `Ride status has been changed to ${status}.`,
    });
  };
  
  const handleDeleteRide = () => {
    // Remove ride from localStorage
    const ridesStr = localStorage.getItem('elitecars_offered_rides') || '[]';
    const rides = JSON.parse(ridesStr);
    const updatedRides = rides.filter((r: Ride) => r.id !== ride.id);
    localStorage.setItem('elitecars_offered_rides', JSON.stringify(updatedRides));
    
    onDelete(ride.id); // This is now a number
    setShowDeleteConfirm(false);
    
    toast({
      title: "Ride deleted",
      description: "Your ride has been deleted successfully.",
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="max-w-3xl w-full mx-auto">
        <Card className="shadow-xl border-none">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl text-slate-800 flex items-center">
                  <Car className="mr-2 text-primary" size={20} />
                  Manage Ride
                </CardTitle>
                <CardDescription>
                  {ride.from} to {ride.to} on {ride.date}
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-primary mb-4">Ride Details</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-primary mr-2" />
                    <div>
                      <p className="font-medium">{ride.from} to {ride.to}</p>
                      <p className="text-sm text-muted-foreground">{ride.fromDetail} → {ride.toDetail}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-primary mr-2" />
                    <div>
                      <p className="font-medium">{ride.date}</p>
                      <p className="text-sm text-muted-foreground">
                        {ride.departureTime} - {ride.arrivalTime}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-primary mr-2" />
                    <div>
                      <p className="font-medium">{ride.seatsAvailable} seats available</p>
                      <p className="text-sm text-muted-foreground">
                        {bookings.length} bookings received
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <IndianRupee className="h-5 w-5 text-primary mr-2" />
                    <div>
                      <p className="font-medium">₹{ride.price} per seat</p>
                      <p className="text-sm text-muted-foreground">
                        Total potential earnings: ₹{parseInt(ride.price) * ride.seatsAvailable}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-primary mb-4">Ride Status</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium mb-2">Current Status</p>
                    <Badge 
                      className={`
                        ${ride.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                        ${ride.status === 'completed' ? 'bg-blue-100 text-blue-800' : ''}
                        ${ride.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                        ${!ride.status ? 'bg-yellow-100 text-yellow-800' : ''}
                      `}
                    >
                      {ride.status || 'Scheduled'}
                    </Badge>
                    
                    <div className="mt-4 space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        onClick={() => handleStatusChange('active')}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Mark Active
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                        onClick={() => handleStatusChange('completed')}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Mark Completed
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                        onClick={() => handleStatusChange('cancelled')}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Cancel Ride
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium mb-2">Passenger Bookings</p>
                    
                    {bookings.length > 0 ? (
                      <div className="space-y-3">
                        {bookings.map((booking, index) => (
                          <div key={index} className="p-3 bg-white rounded border">
                            <div className="flex justify-between">
                              <p className="font-medium">{booking.passengerName}</p>
                              <Badge>{booking.seats} seat(s)</Badge>
                            </div>
                            <p className="text-sm text-gray-500">{booking.passengerPhone}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-3 bg-gray-100 rounded">
                        <p className="text-gray-500">No bookings yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <div className="flex items-center mb-2">
                <AlertCircle className="text-yellow-600 mr-2" size={18} />
                <h4 className="font-medium text-yellow-800">Ride Management</h4>
              </div>
              <p className="text-yellow-700 text-sm">
                You can edit or delete this ride. Note that deleting a ride with active bookings will notify all passengers.
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="bg-gray-50 border-t border-gray-200 flex justify-between">
            <div>
              <Button 
                variant="outline" 
                className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Ride
              </Button>
            </div>
            
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit Ride
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Ride</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this ride? This action cannot be undone.
              {bookings.length > 0 && (
                <p className="mt-2 text-red-600">
                  Warning: This ride has {bookings.length} active bookings. Deleting it will notify all passengers.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRide}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RideManagement;
